"use strict";
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
dotenv_1.default.config();
const app = (0, express_1.default)();
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
app.use("/teacher", teacher_routes_1.default);
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
    app.listen(process.env.PORT, () => {
        console.log("Database connected and Working On " + process.env.PORT);
    });
})
    .catch((err) => {
    console.log(err);
});
