import { CollisionDetector } from "./collision-detector";
import { Line } from "./geometry/Line";
import { Point } from "./geometry/Point";

describe("CollisionDetector.lineRect", () => {
  const detector = new CollisionDetector();
  const rect = { x: 0, y: 0, width: 10, height: 10 };

  it("returns null when there is no collision", () => {
    // Horizontal line above the rectangle
    const line = new Line(new Point(0, -5), new Point(30, -5));
    expect(detector.lineRect(line, rect)).toBeNull();
  });

  it("returns closest intersection point for edge overlap", () => {
    // Vertical line overlapping the left edge
    const line = new Line(new Point(0, 0), new Point(0, 30));
    const result = detector.lineRect(line, rect);
    expect(result).not.toBeNull();
    expect(result instanceof Point).toBe(true);
    expect(result!.x).toBe(0);
    expect(result!.y).toBeGreaterThanOrEqual(rect.y);
    expect(result!.y).toBeLessThanOrEqual(rect.y + rect.height);
  });

  it("returns closest intersection for double point collision", () => {
    // Horizontal line passing through the rectangle
    const line = new Line(new Point(0, 5), new Point(30, 5));
    const result = detector.lineRect(line, rect);
    expect(result).not.toBeNull();
    expect(result instanceof Point).toBe(true);
    expect(result!.x).toBeGreaterThanOrEqual(rect.x);
    expect(result!.x).toBeLessThanOrEqual(rect.x + rect.width);
    expect(result!.y).toBe(5);
  });
});
