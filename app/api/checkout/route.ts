import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { Client, Environment } from 'square';

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});

export async function POST(request: Request) {
  try {
    const { items, customerEmail } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const lineItems = items.map((item: any) => ({
      name: item.name,
      quantity: String(item.quantity),
      basePriceMoney: {
        amount: BigInt(Math.round(item.price * 100)),
        currency: 'USD'
      }
    }));

    const response = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems
      },
      checkoutOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://thecrackedgrain.com'}/checkout/success`,
        askForShippingAddress: true
      }
    });

    if (response.result.paymentLink?.url) {
      return NextResponse.json({
        checkoutUrl: response.result.paymentLink.url,
        orderId: response.result.paymentLink.orderId
      });
    } else {
      throw new Error('No checkout URL returned');
    }

  } catch (error: any) {
    console.error('Square checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
