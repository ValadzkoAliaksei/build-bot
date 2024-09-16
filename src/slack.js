const axios = require('axios');
export const sendMessageToSlack = async (message, id) => {
  try {
    await axios({
      method: 'post',
      url: 'https://slack.com/api/chat.postMessage',
      headers: {
        Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        channel: 'C031EEABR9N',
        text: message,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: message,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Беру',
                  emoji: true,
                },
                value: id,
                style: 'primary',
                action_id: 'take_user',
              },
            ],
          },
        ],
      },
    });
  } catch (e) {
    console.log('ERROR: ', e);
  }
};
