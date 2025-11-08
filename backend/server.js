// server.js
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js'
import path from 'path';
import cron from "node-cron";
import Election from "./models/Election.js"; // adjust path as needed

// Route imports
import authRoutes from './routes/auth.js';
import candidateRoutes from './routes/candidates.js';
import voteRoutes from './routes/votes.js';
import resultRouter from './routes/results.js';
import cookieParser from 'cookie-parser';
import router from './routes/users.js';
import electionRouter from './routes/elections.js';
import settingsRouter from './routes/settings.js';
import dashbourdRoutes from './routes/dashbourd.js';
import managerSettingsRouter from './routes/managerSettings.js';
import ContactRouter from './routes/contact.js';

// dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'backend/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/dashboard", dashbourdRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/users', router);
app.use('/api/votes', voteRoutes);
app.use('/api/admin/settings', settingsRouter);
app.use('/api/manager/settings', managerSettingsRouter);
app.use('/api/elections', electionRouter);
app.use('/api/results', resultRouter);
app.use('/api/contact',ContactRouter)

// ✅ Use absolute path to the "frontend/dist" folder
const __dirname = process.cwd();
const frontendPath = path.join(__dirname, 'frontend/dist');

// Serve all static files (JS, CSS, images)
app.use(express.static(frontendPath));

// 🕐 Runs every hour
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🕒 Running scheduled election status updater...");

    const elections = await Election.find({});
    const now = new Date();

    for (const election of elections) {
      let newStatus;
      if (election.startDate <= now && election.endDate >= now) newStatus = "active";
      else if (election.startDate > now) newStatus = "upcoming";
      else if (election.endDate < now) newStatus = "completed";

      if (election.status !== newStatus) {
        election.status = newStatus;
        await election.save();
        console.log(`✅ Updated election ${election.title} → ${newStatus}`);
      }
    }

    console.log("✅ All election statuses checked and updated.");
  } catch (error) {
    console.error("❌ Error updating election statuses:", error);
  }
});
 
app.get(/\/(.*)/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.post('/api/logout',(req,res)=>{
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});