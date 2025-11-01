import mongoose from 'mongoose';
import validator from 'validator';

const counterSchema = new mongoose.Schema({
  _id: String,
  seq: Number
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values for non-students
    match: [/^GUL\d{6}$/, 'Student ID must be in format: GUL123456']
  },
  password: { 
    type: String, 
  },
  class: {
    type: String,
    enum: ['seven', 'eight', 'nine','ten', 'eleven', 'twelve'],
    // required: function() {
    //   return this.role === 'student';
    // }
  },
  hasVoted: { 
    type: Boolean, 
    default: false 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  // a property for the type of the system users like university or school
  type:{
    type:String,
    enum: ['university', 'school'],
    default:'university'
  },
  semester:{
    type:String,
    enum: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'],
  },
  faculty:{
    type:String,
    enum: ['science', 'arts', 'commerce', 'engineering', 'medical', 'law' , 'education' , 'management' , 'agriculture' , 'architecture' , 'pharmacy' , 'nursing' , 'dentistry' , 'veterinary',  'forestry' , 'fisheries' , 'social science' , 'information technology' , 'environmental science' , 'mass communication' , 'public health' , 'physical education' , 'urban planning' , 'hotel management' , 'tourism' , 'fashion design' , 'graphic design' , 'animation' , 'film studies' , 'performing arts' , 'culinary arts' , 'interior design' , 'event management' , 'sports science' , 'data science' , 'cyber security' , 'artificial intelligence' , 'robotics', 'other'],
  },
 email: {
    type: String,
    unique: true,
    sparse: true, // This allows multiple null values
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Only validate if email is provided
        if (v === null || v === undefined || v === '') return true;
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email`
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin', 'student'],
    default: 'student'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedAt: { type: Date },
}, { timestamps: true });

// Auto-generate studentId & password
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    // For admin/superadmin - only generate password
    if (this.role === 'admin' || this.role === 'superadmin') {
      // Clear student-specific fields
      this.studentId = undefined;
      this.class = undefined;
      this.hasVoted = undefined;
      this.isAdmin = true;

      // Generate password if not provided
      if (!this.password) {
        const randomNum = String(Math.floor(100000 + Math.random() * 900000));
        this.password = `GUL${randomNum}`;
      }
      return next();
    } 

    // For students - generate both studentId and password
    if (this.role === 'student') {
      // Student ID Auto-generate
      if (!this.studentId) {
        const counter = await Counter.findByIdAndUpdate(
          { _id: 'studentId' },
          { $inc: { seq: 1 } },
          { upsert: true, new: true }
        );

        const number = String(counter.seq).padStart(6, '0');
        this.studentId = `GUL${number}`;
      }

      // Password Auto-generate (if not provided)
      if (!this.password) {
        const randomNum = String(Math.floor(100000 + Math.random() * 900000));
        this.password = `GUL${randomNum}`;
      }
    }
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);