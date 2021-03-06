"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const parsePredictions_1 = require("../../utils/parsePredictions");
function addRoute(router, database) {
    router.get('/predictions', (_req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const predictions = yield database.getLastPrediction();
            const parsedPredictions = parsePredictions_1.parsePredictions(predictions);
            res.send(parsedPredictions);
        }
        catch (error) {
            res.status(500).send({ message: 'Error in /predictions', error });
        }
    }));
    router.get('/predictions/:country', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const prediction = yield database.getCountryPrediction(req.params.country);
            const parsedPredictions = parsePredictions_1.parsePredictions(prediction);
            res.send(parsedPredictions);
        }
        catch (error) {
            res.status(500).send({ message: 'Error in /predictions/:country', error });
        }
    }));
}
exports.addRoute = addRoute;
