export const templates = {
  registerEmail(to: string, from: string, url: string) {
    return {
      to,
      from,
      subject: 'Email address confirmation',
      html: `
          <div>
            <div style="background: #FFFFFF; margin-top: 0;">
              <h4 style="font-family: -apple-system,BlinkMacSystemFont,system-ui,Quicksand,sans-serif; font-style: normal; font-weight: 600; font-size: 26px; line-height: 38px; color: #000000; margin-top: 10px;">Thank you for your registration!</h4>
              <br>
              <div style="font-size: 20px">Please confirm your account via this link: <a target="_blank" href=${url}>${url}</a></div>
            </div>
          </div>
      `,
    };
  },
  generalEmail(
    to: string,
    from: string,
    emailDescription: string,
    emailContent: string,
  ) {
    return {
      to,
      from,
      subject: 'Greeting Email',
      html: `
          <div>
            <div style="background: #FFFFFF; margin-top: 0;">
              <h4 style="font-family: -apple-system,BlinkMacSystemFont,system-ui,Quicksand,sans-serif; font-style: normal; font-weight: 600; font-size: 26px; line-height: 38px; color: #000000; margin-top: 10px;">Message from jetbase.io</h4>
              <br>
              <div style="font-size: 20px"><span style="font-family: -apple-system,BlinkMacSystemFont,system-ui,Quicksand,sans-serif; font-style: normal; font-weight: 500; font-size: 16px; line-height: 22px; color: #000000;">Email:</span> ${emailContent}</div>
              <div style="font-size: 20px"><span style="font-family: -apple-system,BlinkMacSystemFont,system-ui,Quicksand,sans-serif; font-style: normal; font-weight: 500; font-size: 16px; line-height: 22px; color: #000000;">Text:</span> ${emailDescription}</div>
            </div>
          </div>
        `,
    };
  },
};
