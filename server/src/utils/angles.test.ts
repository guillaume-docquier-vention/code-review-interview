import { degreesToRadians } from './angles'

describe('angles', () => {
  describe('degreesToRadians', () => {
    it('should convert degrees to radians', () => {
      // Arrange
      const degrees = 90

      // Act
      const radians = degreesToRadians(degrees)

      // Assert
      expect(radians).toEqual(Math.PI / 2)
    });
  });
});
