







export class Geometry {
    static intersects(o1, o2) { return Geometry.distance(o1, o2) < o1.radius + o2.radius; }


    static vectorFromPolar(a, r = 1.0) {
        return { x: r * Math.cos(a), y: r * Math.sin(a) };
    }

    static angleBetween(o1, o2) {
        return Math.atan2(o2.y - o1.y, o2.x - o1.x)
    }

    static add(v, v2) { return { x: v.x + v2.x, y: v.y + v2.y }; }
    static diff(v, v2) { return { x: v2.x - v.x, y: v2.y - v.y }; }

    static norm(v) {
        return Math.sqrt((v.x) ** 2 + (v.y) ** 2);
    }

    static normalize(v, factor = 1) {
        const d = Geometry.norm(v);
        return { x: factor * v.x / d, y: factor * v.y / d };
    }
    static distance(a, b) {
        if (a.position)
            a = a.position;
        if (b.position)
            b = b.position;
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }



    static touches(o1ToMove, o2Fixed) {
        const d = Geometry.distance(o1ToMove, o2Fixed);
        const dr = d - o1ToMove.radius - o2Fixed.radius;
        const angle = Math.atan2(o1ToMove.position.y - o2Fixed.position.y, o1ToMove.position.x - o2Fixed.position.x);
        o1ToMove.position = { x: o1ToMove.position.x - dr * Math.cos(angle), y: o1ToMove.position.y - dr * Math.sin(angle) }

    }

    static moveOutside(o1ToMove, o2Fixed) {
        const d = Geometry.distance(o1ToMove, o2Fixed);
        const dr = d - o1ToMove.radius - o2Fixed.radius;
        const angle = Math.atan2(o1ToMove.position.y - o2Fixed.position.y, o1ToMove.position.x - o2Fixed.position.x);
        o1ToMove.position = { x: o1ToMove.position.x - dr * Math.cos(angle), y: o1ToMove.position.y - dr * Math.sin(angle) }
    }


    static bounce(toBeMoved, staticObject, SPEED = 1) {
        const d = Geometry.distance(toBeMoved, staticObject);
        const dr = d - toBeMoved.radius - staticObject.radius;
        const angle = Math.atan2(toBeMoved.position.y - staticObject.position.y, toBeMoved.position.x - staticObject.position.x);
        toBeMoved.position = { x: toBeMoved.position.x - dr * Math.cos(angle), y: toBeMoved.position.y - dr * Math.sin(angle) }
        toBeMoved.velocity = { x: SPEED * Math.cos(angle), y: SPEED * Math.sin(angle) }
    }

}




