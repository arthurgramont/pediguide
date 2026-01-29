import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { diditService } from '../services/didit.service';
import { db } from '../db';
import { doctors } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Start KYC verification for a doctor
 * Creates a Didit verification session and stores the session ID
 * Requires authentication - uses doctor ID from JWT token
 */
export async function startKyc(req: AuthRequest, res: Response): Promise<any> {
  try {
    // Get doctor ID from authenticated user
    const doctorId = req.user?.id;

    if (!doctorId) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    // Check if doctor exists
    const doctor = await db
      .select()
      .from(doctors)
      .where(eq(doctors.id, doctorId))
      .limit(1);

    if (!doctor.length) {
      return res.status(404).json({
        error: 'Doctor not found',
      });
    }

    // Check if already verified
    if (doctor[0].kycStatus === 'verified') {
      return res.status(400).json({
        error: 'Doctor is already verified',
      });
    }

    // Create verification session with Didit
    const session = await diditService.createVerificationSession(String(doctorId));

    // Update doctor record with session ID
    await db
      .update(doctors)
      .set({
        kycSessionId: session.session_id,
        kycStatus: 'pending',
      })
      .where(eq(doctors.id, doctorId));

    res.json({
      success: true,
      redirect_url: session.url || session.redirect_url, // Handle V2 response
      session_id: session.session_id,
    });
  } catch (error: any) {
    console.error('Error starting KYC verification:', error);
    res.status(500).json({
      error: 'Failed to start verification process',
      details: error.message,
    });
  }
}

/**
 * Handle webhook from Didit
 * Verifies signature and updates doctor KYC status
 */
export async function handleWebhook(req: Request, res: Response): Promise<any> {
  try {
    console.log('📥 [Webhook] Received webhook from Didit');
    console.log('📥 [Webhook] Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📥 [Webhook] Body:', JSON.stringify(req.body, null, 2));

    // Get signature from header
    const signature = req.headers['x-didit-signature'] as string;

    if (!signature) {
      console.error('❌ [Webhook] Missing webhook signature');
      return res.status(401).json({
        error: 'Missing webhook signature',
      });
    }

    // Verify webhook signature
    const rawBody = JSON.stringify(req.body);
    const isValid = diditService.verifyWebhookSignature(signature, rawBody);

    if (!isValid) {
      console.error('❌ [Webhook] Invalid webhook signature');
      return res.status(403).json({
        error: 'Invalid signature',
      });
    }

    console.log('✅ [Webhook] Signature verified successfully');

    // Extract webhook data
    const { status, vendor_data, session_id, verification_data } = req.body;

    // vendor_data is expected to be the doctor ID string directly
    if (!vendor_data || typeof vendor_data !== 'string') {
      console.error('❌ [Webhook] Missing doctor_id (vendor_data is not a string):', vendor_data);
      return res.status(400).json({
        error: 'Missing doctor_id in webhook data',
      });
    }

    const doctorId = vendor_data;
    console.log(`🔍 [Webhook] Processing for doctor ID: ${doctorId}`);

    // Map Didit status to our KYC status
    let kycStatus: 'verified' | 'rejected' | 'pending';

    switch (status?.toLowerCase()) {
      case 'verified':
      case 'completed':
      case 'approved':
        kycStatus = 'verified';
        break;
      case 'rejected':
      case 'failed':
        kycStatus = 'rejected';
        break;
      default:
        kycStatus = 'pending';
    }

    // Update doctor KYC status in database
    console.log(`💾 [Webhook] Updating database for doctor ${doctorId} with status: ${kycStatus}`);

    await db
      .update(doctors)
      .set({
        kycStatus,
        kycData: {
          status,
          session_id,
          verification_data,
          updated_at: new Date().toISOString(),
        },
      })
      .where(eq(doctors.id, doctorId));

    console.log(`✅ [Webhook] KYC status updated for doctor ${doctorId}: ${kycStatus}`);

    res.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error: any) {
    console.error('❌ [Webhook] Error handling webhook:', error);
    res.status(500).json({
      error: 'Failed to process webhook',
      details: error.message,
    });
  }
}
