export default function handler(req, res) {
  try {
    const { filename } = req.query || {};

    return res.status(200).json({
      ok: true,
      message: "API is working",
      filename: filename || null
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.toString()
    });
  }
}
