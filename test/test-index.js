/*!
 * Copyright (c) 2017 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var EventEmitter = require('events');
var util = require('util');
var assert = require('assert');

var ModbusRtuMaster = require('../src/index');

require('t');

function Uart() {
    EventEmitter.call(this);
}
util.inherits(Uart, EventEmitter);
Uart.prototype.write = function () {
};

describe('Test modbus request data in RTU mode', function () {
    var modbus;
    var uart;
    var receviedData;

    describe('Test for response data converted', function () {
        beforeEach(function () {
            uart = new Uart();
            uart.write = function (data, callback) {
                callback && callback();
                uart.emit('data', receviedData);
            };
            modbus = new ModbusRtuMaster(uart, {
                parseSlaveData: true
            });
        });
        afterEach(function () {
            uart.removeAllListeners();
        });

        it('0x01 function `readCoils`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x01;
            var startAddress = 0x13;
            var quantity = 0x13;
            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                0x03,
                0xCD, 0x68, 0x05,
                0x42, 0x72
            ]);
            var expectedStatus = [
                1, 0, 1, 1, 0, 0, 1, 1, // 0xCD
                0, 0, 0, 1, 0, 1, 1, 0, // 0x68
                1, 0, 1 // 0x05
            ];

            modbus.readCoils(slaveAddress, startAddress, quantity, function (error, status) {
                if (error) {
                    done(error);
                    return;
                }
                assert.deepEqual(status, expectedStatus);
                done();
            });
        });

        it('0x02 function `readDiscreteInputs`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x02;
            var startAddress = 0xC4;
            var quantity = 0x16;

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                0x03,
                0xAC, 0xDB, 0x35,
                0x22, 0x88
            ]);

            var expectedStatus = [
                0, 0, 1, 1, 0, 1, 0, 1, // 0xAC
                1, 1, 0, 1, 1, 0, 1, 1, // 0xDB
                1, 0, 1, 0, 1, 1 // 0x35
            ];
            modbus.readDiscreteInputs(slaveAddress, startAddress, quantity, function (error, status) {
                if (error) {
                    done(error);
                    return;
                }
                assert.deepEqual(status, expectedStatus);
                done();
            });
        });

        it('0x03 function `readHoldingRegisters`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x03;
            var startAddress = 0x6B;
            var quantity = 0x03;

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                quantity * 2,
                0x02, 0x2B, // 0x022B
                0x00, 0x00, // 0x0000
                0x00, 0x64, // 0x0064
                0x05, 0x7a
            ]);

            var expectedValues = [0x022B, 0x0000, 0x0064];
            modbus.readHoldingRegisters(slaveAddress, startAddress, quantity, function (error, values) {
                if (error) {
                    done(error);
                    return;
                }
                assert.deepEqual(values, expectedValues);
                done();
            });
        });

        it('0x04 function `readInputRegisters`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x04;
            var startAddress = 0x08;
            var quantity = 0x01;

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                quantity * 2,
                0x00, 0x0A, // 0x000A
                0x39, 0x37
            ]);

            var expectedValues = [0x000A];
            modbus.readInputRegisters(slaveAddress, startAddress, quantity, function (error, values) {
                if (error) {
                    done(error);
                    return;
                }
                assert.deepEqual(values, expectedValues);
                done();
            });
        });

        it('0x05 function `writeSingleCoil`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x05;
            var address = 0x00AC;
            var expectedState = 1;

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                0x00, 0xAC, // address
                0xFF, 0x00, // expectedState
                0x4C, 0x1B
            ]);

            modbus.writeSingleCoil(slaveAddress, address, expectedState, function (error, state) {
                if (error) {
                    done(error);
                    return;
                }
                assert.equal(state, expectedState);
                done();
            });
        });

        it('0x06 function `writeSingleRegister`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x06;
            var address = 0x0001;
            var expectedValue = 0x0003;

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                0x00, 0x01, // address
                0x00, 0x03, // expectedValue
                0x98, 0x0B
            ]);

            modbus.writeSingleRegister(slaveAddress, address, expectedValue, function (error, state) {
                if (error) {
                    done(error);
                    return;
                }
                assert.equal(state, expectedValue);
                done();
            });
        });

        it('0x0F function `writeMultipleCoils`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x0F;
            var startAddress = 0x0013;
            var states = [
                1, 0, 1, 1, 0, 0, 1, 1,
                1, 0
            ];

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                0x00, 0x13, // startAddress
                0x00, 0x0A, // length of states
                0x24, 0x09
            ]);

            modbus.writeMultipleCoils(slaveAddress, startAddress, states, function (error, quantity) {
                if (error) {
                    done(error);
                    return;
                }
                assert.equal(states.length, quantity);
                done();
            });
        });

        it('0x10 function `writeMultipleRegisters`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x10;
            var startAddress = 0x0001;
            var values = [
                0x000A,
                0x0102
            ];

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                0x00, 0x01, // startAddress
                0x00, 0x02, // length of values
                0x10, 0x08
            ]);

            modbus.writeMultipleRegisters(slaveAddress, startAddress, values, function (error, quantity) {
                if (error) {
                    done(error);
                    return;
                }
                assert.equal(values.length, quantity);
                done();
            });
        });
    });

    describe('Test for response data unconverted', function () {
        beforeEach(function () {
            uart = new Uart();
            uart.write = function (data, callback) {
                callback && callback();
                uart.emit('data', receviedData);
            };
            modbus = new ModbusRtuMaster(uart, {
                parseSlaveData: false
            });
        });
        afterEach(function () {
            uart.removeAllListeners();
        });

        it('0x01 function `readCoils`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x01;
            var startAddress = 0x13;
            var quantity = 0x13;
            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                0x03,
                0xCD, 0x68, 0x05,
                0x42, 0x72
            ]);
            var expectedStatus = [
                0xCD, 0x68, 0x05
            ];

            modbus.readCoils(slaveAddress, startAddress, quantity, function (error, status) {
                if (error) {
                    done(error);
                    return;
                }
                assert.deepEqual(status, expectedStatus);
                done();
            });
        });
        it('0x02 function `readDiscreteInputs`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x02;
            var startAddress = 0xC4;
            var quantity = 0x16;

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                0x03,
                0xAC, 0xDB, 0x35,
                0x22, 0x88
            ]);

            var expectedStatus = [
                0xAC, 0xDB, 0x35
            ];
            modbus.readDiscreteInputs(slaveAddress, startAddress, quantity, function (error, status) {
                if (error) {
                    done(error);
                    return;
                }
                assert.deepEqual(status, expectedStatus);
                done();
            });
        });
        it('0x03 function `readHoldingRegisters`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x03;
            var startAddress = 0x6B;
            var quantity = 0x03;

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                quantity * 2,
                0x02, 0x2B, // 0x022B
                0x00, 0x00, // 0x0000
                0x00, 0x64, // 0x0064
                0x05, 0x7a
            ]);

            var expectedValues = [0x02, 0x2B, 0x00, 0x00, 0x00, 0x64];
            modbus.readHoldingRegisters(slaveAddress, startAddress, quantity, function (error, values) {
                if (error) {
                    done(error);
                    return;
                }
                assert.deepEqual(values, expectedValues);
                done();
            });
        });
        it('0x04 function `readInputRegisters`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x04;
            var startAddress = 0x08;
            var quantity = 0x01;

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                quantity * 2,
                0x00, 0x0A, // 0x000A
                0x39, 0x37
            ]);

            var expectedValues = [0x00, 0x0A];
            modbus.readInputRegisters(slaveAddress, startAddress, quantity, function (error, values) {
                if (error) {
                    done(error);
                    return;
                }
                assert.deepEqual(values, expectedValues);
                done();
            });
        });
        it('0x05 function `writeSingleCoil`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x05;
            var address = 0x00AC;
            var expectedState = 1;

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                0x00, 0xAC, // address
                0xFF, 0x00, // expectedState
                0x4C, 0x1B
            ]);

            modbus.writeSingleCoil(slaveAddress, address, expectedState, function (error, state) {
                if (error) {
                    done(error);
                    return;
                }
                assert.deepEqual(state, [0xFF, 0x00]);
                done();
            });
        });
        it('0x06 function `writeSingleRegister`', function (done) {
            var slaveAddress = 0x01;
            var functionCode = 0x06;
            var address = 0x0001;
            var expectedValue = 0x0003;

            receviedData = Buffer.from([
                slaveAddress,
                functionCode,
                0x00, 0x01, // address
                0x00, 0x03, // expectedValue
                0x98, 0x0B
            ]);

            modbus.writeSingleRegister(slaveAddress, address, expectedValue, function (error, state) {
                if (error) {
                    done(error);
                    return;
                }
                assert.deepEqual(state, [0x00, 0x03]);
                done();
            });
        });
    });
});
