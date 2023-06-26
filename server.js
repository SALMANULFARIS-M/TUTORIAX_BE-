"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const student_routes_1 = __importDefault(require("./routes/student_routes"));
const admin_routes_1 = __importDefault(require("./routes/admin_routes"));
const teacher_routes_1 = __importDefault(require("./routes/teacher_routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const http = __importStar(require("http"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = http.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: 'http://localhost:4200' },
});
;
app.use((0, cors_1.default)({
    credentials: true,
    origin: [process.env.ORIGIN],
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "public/images/")));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/", student_routes_1.default);
app.use("/admin", admin_routes_1.default);
app.use("/tutor", teacher_routes_1.default);
// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not found' });
});
// Handle 500 errors
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal server error' });
});
// Handle 502 errors
app.use((err, req, res, next) => {
    res.status(502).json({ error: 'Bad gateway' });
});
mongoose_1.default
    .connect(process.env.MONGODBSERVER)
    .then(() => {
    httpServer.listen(process.env.PORT, () => {
        console.log("Database connected and Working On " + process.env.PORT);
    });
})
    .catch((err) => {
    next(err);
});
function next(err) {
    throw new Error("Function not implemented.");
}
