import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await dbConnect();
    await Order.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Delete order error', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
