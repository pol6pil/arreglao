// // Start by creating some disk storage options:
// const storage = multer.diskStorage({
//     destination: './uploadedContent',
//     filename: function(_req, file, cb)
//       cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
//   });
// var upload = multer({
//     storage: storage,
//     limits: {
//         fieldNameSize: 50, // TODO: Check if this size is enough
//         fieldSize: 20000, //TODO: Check if this size is enough
//         // TODO: Change this line after compression
//         fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
//     },
//     fileFilter: function(_req, file, cb){
//         checkFileType(file, cb);
//     }
// }).array('postPicture');
// function checkFileType(file, cb){
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif|webp/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if(mimetype && extname){
//     return cb(null, true);
//   } else {
//     return cb(null, false);
//   }
// }
