import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { Client, Environment } from 'square';

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? Environment.Production
    : Environment.Sandbox
});

export async function POST(request: Request) {
  try {
    const { sourceId, items, shippingInfo, amount } = await request.json();

    if (!sourceId) {
      return NextResponse.json({ error: 'Payment token required' }, { status: 400 });
    }

    // Create the payment
    const paymentResponse = await squareClient.paymentsApi.createPayment({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(amount),
        currency: 'USD'
      },
      locationId: process.env.SQUARE_LOCATION_ID!,
      buyerEmailAddress: shippingInfo.email,
      shippingAddress: {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        addressLine1: shippingInfo.address,
        locality: shippingInfo.city,
        administrativeDistrictLevel1: shippingInfo.state,
        postalCode: shippingInfo.zip,
        country: 'US'
      },
      note: `Online order: ${items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}`
    });

    if (paymentResponse.result.payment?.status === 'COMPLETED') {
      // Payment successful
      // TODO: Create order in your database, send confirmation email, etc.

      return NextResponse.json({
        success: true,
        orderId: paymentResponse.result.payment.id,
        receiptUrl: paymentResponse.result.payment.receiptUrl
      });
    } else {
      return NextResponse.json({
        error: 'Payment not completed',
        status: paymentResponse.result.payment?.status
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment failed' },
      { status: 500 }
    );
  }
}
