/*global describe, it, beforeEach, expect, spyOn, jasmine*/
/*eslint camelcase: 0, no-invalid-this: 0 */

const ProvinceCard = require('../../../server/game/provincecard.js');

describe('ProvinceCard', function () {
    beforeEach(function () {
        this.testCard = { code: '111', label: 'test 1(some pack)', name: 'test 1' };
        this.gameSpy = jasmine.createSpyObj('game', ['raiseEvent']);
        this.card = new ProvinceCard({ game: this.gameSpy }, this.testCard);
        spyOn(this.card.events, 'register');
        spyOn(this.card.events, 'unregisterAll');
    });

    describe('moveTo()', function() {
        it('should set the location', function() {
            this.card.moveTo('stronghold province');
            expect(this.card.location).toBe('stronghold province');
        });

        describe('when the card is facedown', function() {
            beforeEach(function() {
                this.card.facedown = true;
            });

            describe('when moved to the play area', function() {
                beforeEach(function() {
                    this.card.moveTo('play area');
                });

                it('should not flip the card', function() {
                    expect(this.card.facedown).toBe(true);
                });
            });

            describe('when moved to somewhere other than the play area', function() {
                beforeEach(function() {
                    this.card.moveTo('hand');
                });

                it('should flip the card', function() {
                    expect(this.card.facedown).toBe(false);
                });
            });
        });

        describe('when the card has events', function() {
            beforeEach(function() {
                this.card.registerEvents(['foo', 'bar']);
            });

            describe('when in a non-event handling area', function() {
                beforeEach(function() {
                    this.card.location = 'province deck';
                });

                describe('and moving to another non-event handling area', function() {
                    beforeEach(function() {
                        this.card.moveTo('stronghold province');
                    });

                    it('should not register events', function() {
                        expect(this.card.events.register).not.toHaveBeenCalled();
                    });

                    it('should not unregister events', function() {
                        expect(this.card.events.unregisterAll).not.toHaveBeenCalled();
                    });
                });

                describe('and moving to an event handling area', function() {
                    beforeEach(function() {
                        this.card.moveTo('province');
                    });

                    it('should register events', function() {
                        expect(this.card.events.register).toHaveBeenCalledWith(['foo', 'bar']);
                    });

                    it('should not unregister events', function() {
                        expect(this.card.events.unregisterAll).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when in an event handling area', function() {
                beforeEach(function() {
                    this.card.location = 'province';
                });

                describe('and moving to another event handling area', function() {
                    beforeEach(function() {
                        this.card.moveTo('province');
                    });

                    it('should not register events', function() {
                        expect(this.card.events.register).not.toHaveBeenCalled();
                    });

                    it('should not unregister events', function() {
                        expect(this.card.events.unregisterAll).not.toHaveBeenCalled();
                    });
                });

                describe('and moving to a non-event handling area', function() {
                    beforeEach(function() {
                        this.card.moveTo('province deck');
                    });

                    it('should not register events', function() {
                        expect(this.card.events.register).not.toHaveBeenCalled();
                    });

                    it('should unregister events', function() {
                        expect(this.card.events.unregisterAll).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
