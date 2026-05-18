module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { project, email, date, time } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Build email content based on which form was submitted
  const isMeetingRequest = date || time;

  const subject = isMeetingRequest
    ? 'Meeting Request — Arc Creative'
    : 'New Project Inquiry — Arc Creative';

  const html = isMeetingRequest
    ? `
      <h2>Meeting Request</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Preferred Date:</strong> ${date || 'Not provided'}</p>
      <p><strong>Preferred Time:</strong> ${time || 'Not provided'}</p>
    `
    : `
      <h2>New Project Inquiry</h2>
      <p><strong>Project:</strong> ${project || 'Not provided'}</p>
      <p><strong>Email:</strong> ${email}</p>
    `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Arc Creative <hello@arccreativeagency.com>',
        to: ['inquiry.arcca@gmail.com'],
        reply_to: email,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resend API error:', errorData);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
