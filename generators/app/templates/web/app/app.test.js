// Consider this a heart beat test to validate that the testing setting up is working.
// No matter what, there should always be at least this one passing test.
(function () {
    describe('A default test suite', function () {
        it('contains a spec with a default spec to make sure tests are running :)', function () {
            expect(true).toBe(true);
        });
    });
})();
