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
const mongodb_1 = require("mongodb");
const options_1 = require("../options");
const DB = options_1.default.mongodb.db;
const PREDICTIONS = options_1.default.mongodb.collection_predictions;
const DISTRIBUTIONS = options_1.default.mongodb.collection_distributions;
class Database {
    constructor(uri, options = {}) {
        this.connection = null;
        this.options = {
            useUnifiedTopology: true,
            useNewUrlParser: true
        };
        this.uri = uri;
        this.options = Object.assign(Object.assign({}, options), this.options);
    }
    get connected() {
        return this.connection !== null;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected) {
                this.connection = yield mongodb_1.MongoClient.connect(this.uri, this.options);
            }
        });
    }
    getLastPrediction() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const lastPrediction = yield this.connection
                .db(DB)
                .collection(PREDICTIONS)
                .find()
                .sort({ timestamp: -1 })
                .limit(1)
                .toArray();
            yield this.disconnect();
            return lastPrediction[0];
        });
    }
    getCountryPrediction(country) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const lastPrediction = yield this.connection
                .db(DB)
                .collection(PREDICTIONS)
                .aggregate([
                {
                    $project: {
                        results: {
                            $filter: {
                                input: '$results',
                                cond: { $eq: ['$$this.country_code', country] }
                            }
                        },
                        timestamp: 1
                    }
                }
            ])
                .sort({ timestamp: -1 })
                .limit(1)
                .toArray();
            yield this.disconnect();
            return lastPrediction[0];
        });
    }
    getLastDistributions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const lastDistributions = yield this.connection
                .db(DB)
                .collection(DISTRIBUTIONS)
                .find()
                .sort({ timestamp: -1 })
                .limit(1)
                .toArray();
            yield this.disconnect();
            return lastDistributions[0];
        });
    }
    getDistributionsByDonor(donor) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const lastDistributions = yield this.connection
                .db(DB)
                .collection(DISTRIBUTIONS)
                .aggregate([
                {
                    $project: {
                        distributions: {
                            $filter: {
                                input: '$distributions',
                                cond: { $eq: ['$$this.donor', donor] }
                            }
                        },
                        timestamp: 1
                    }
                }
            ])
                .sort({ timestamp: -1 })
                .limit(1)
                .toArray();
            yield this.disconnect();
            return lastDistributions[0];
        });
    }
    getDistributionsByRecipient(recipient) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect();
            const lastDistributions = yield this.connection
                .db(DB)
                .collection(DISTRIBUTIONS)
                .aggregate([
                {
                    $project: {
                        distributions: {
                            $filter: {
                                input: '$distributions',
                                cond: { $eq: ['$$this.recipient', recipient] }
                            }
                        },
                        timestamp: 1
                    }
                }
            ])
                .sort({ timestamp: -1 })
                .limit(1)
                .toArray();
            yield this.disconnect();
            return lastDistributions[0];
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connected) {
                yield this.connection.close();
                this.connection = null;
            }
        });
    }
}
exports.Database = Database;
