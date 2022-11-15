export const templates = {
  registerCompanyEmail(
    to: string,
    from: string,
    description: string,
    email: string,
  ) {
    return {
      to,
      from,
      subject: 'Greeting Email',
      html: `
          <div>
            <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet" type="text/css">
            <div style="background: #FFFFFF; margin-top: 0;">
              <h4 style="font-family: -apple-system,BlinkMacSystemFont,system-ui,Quicksand,sans-serif; font-style: normal; font-weight: 600; font-size: 26px; line-height: 38px; color: #000000; margin-top: 10px;">Message from jetbase.io</h4>
              <br>
              <div style="font-size: 20px"><span style="font-family: -apple-system,BlinkMacSystemFont,system-ui,Quicksand,sans-serif; font-style: normal; font-weight: 500; font-size: 16px; line-height: 22px; color: #000000;">Email:</span> ${email}</div>
              <div style="font-size: 20px"><span style="font-family: -apple-system,BlinkMacSystemFont,system-ui,Quicksand,sans-serif; font-style: normal; font-weight: 500; font-size: 16px; line-height: 22px; color: #000000;">Text:</span> ${description}</div>
            </div>
          </div>
        `,
    };
  },
};
