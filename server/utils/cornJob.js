import cron from "node-cron";
import { generateQRCode } from "./services/qrService"; 

cron.schedule('0 0 * * *', async () => {
  try {
    const users = await User.find({ status: 'active' }); 
    for (const user of users) {
      await generateQRCode(user); 
    }
  } catch (error) {
    console.error("Error generating daily QR codes:", error);
  }
});
