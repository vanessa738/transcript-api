export default function handler(req, res) {
  try {
    const filename = req.query.filename || null;

    return res.status(200).json({
      ok: true,
      message: "API is working",
      filename: filename
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.toString()
    });
  }
}
