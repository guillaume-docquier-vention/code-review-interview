import { Pendulum } from './Pendulum'
import { EARTH_GRAVITY, NO_WIND } from '../../constants'

describe('Pendulum', () => {
  describe('tick', () => {
    it('should be tested more', () => {
      // TODO Add tests for tick()
    });
  });

  describe('get rodLength', () => {
    it('should return the length of the rod', () => {
      // Arrange
      const pendulum = new Pendulum(
        { x: 2, y: 10 },
        { x: 2, y: 0 },
        0,
        0,
        0,
        NO_WIND,
        EARTH_GRAVITY,
      );

      // Act
      const rodLength = pendulum.rodLength

      // Assert
      expect(rodLength).toEqual(10)
    });
  });
});
