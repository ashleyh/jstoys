/*
    Copyright 2010 Ashley Hewson

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


addToy({
    name: "physics2",
    contributors: "ash",
    constructor: function(ctx, width, height) {
        var S = 100

        function Vector(x, y) {
            this.x = x
            this.y = y
            this.lengthSquared = x*x + y*y
        }

        Vector.prototype.add = function(other) {
            return new Vector(this.x + other.x, this.y + other.y)
        }

        Vector.prototype.sub = function(other) {
            return new Vector(this.x - other.x, this.y - other.y)
        }

        Vector.prototype.scale = function (k) {
            return new Vector(this.x * k, this.y * k)
        }

        Vector.prototype.perp = function() {
            return new Vector(-this.y, this.x)
        }

        Vector.prototype.unit = function() {
            var l =  this.lengthSquared
            if (l != 0.0) {
                return this.scale(1.0/Math.sqrt(l))
            } else {
                return this
            }
        }

        Vector.prototype.dot = function(other) {
            return this.x*other.x + this.y*other.y
        }
            


        function Circle(center, r) {
            this.center = center
            this.r = r
        }

        Circle.prototype.draw = function() {
            ctx.beginPath()
            ctx.arc(S*this.center.x,height - S*this.center.y,S*this.r,0,2*Math.PI,true)
            ctx.stroke()
        }            

        Circle.prototype.getContactsWithCircle = function(other) {
            var displ = other.center.sub(this.center)
            var l = Math.sqrt(displ.lengthSquared)
            var overlap = this.r + other.r - l
            if (overlap > 0) {
                var normal = displ.scale(1.0 / l)
                var c = new Contact(this, other, normal, overlap)
                return [c]
            } else {
                return []
            }
        }


        function Line(a, b) { // r = a + tb
            this.a = a
            this.b = b
        }

        Line.prototype.draw = function() {
            var worldWidth = width / S
            var worldHeight = height / S

            var v = this.a
            while( (v.x >= 0 && v.x <= worldWidth) ||
                    (v.y >= 0 && v.y <= worldHeight) ) {
                v = v.add(this.b)
            }


            ctx.beginPath()
            ctx.moveTo(S*v.x, height - S*v.y)

            v = this.a
            while( (v.x >= 0 && v.x <= worldWidth) ||
                    (v.y >= 0 && v.y <= worldHeight) ) {
                v = v.add(this.b.scale(-1))
            }

            ctx.lineTo(S*v.x, height - S*v.y)
            ctx.stroke()
                
        }
        
        

        Line.prototype.getContactsWithCircle = function (circle) {
            var normal = this.b.perp().unit()
            var d = normal.dot(circle.center.sub(this.a))
            var overlap = circle.r - Math.abs(d) 

            if (overlap > 0) {
                var c = new Contact(this, circle, normal, overlap)
                return [c]
            } else {
                return []
            }
        }


        function Contact(body1, body2, normal, overlap) {
            this.body1 = body1
            this.body2 = body2
            this.normal = normal
            this.overlap = overlap
        }

        Contact.prototype.resolve = function() {
            var rv = this.body2.velocity.sub(this.body1.velocity)
            var vn = rv.dot(this.normal)
            if (this.body1 instanceof Circle) {
                this.body1.velocity = this.body1.velocity.add(
                    this.normal.scale(vn)
                    )
            }
            if (this.body2 instanceof Circle) {
                this.body2.velocity = this.body2.velocity.sub(
                    this.normal.scale(vn)
                    )
            }
        }


        function lineThru(x0, y0, x1, y1) {
            // a x0 + b y0 + c = 0
            // a x1 + b y1 + c = 0

            // a(x0-x1) + b(y0-y1) = 0

            return new Line(
                new Vector(x0, y0),
                new Vector(x1 - x0, y1 - y0)
                )
        }

        var lines = []
        var circles = []
        var Zero = new Vector(0, 0)
        var gravity = new Vector(0, -5)
        var invDt = 1.0/60.0

        function addLine(x0, y0, x1, y1) {
            l = lineThru(x0, y0, x1, y1)
            l.id = lines.length
            l.invMass = 0.0
            l.velocity = Zero
            lines.push(l)
        }

        function addCircle(x, y, r) {
            c = new Circle(new Vector(x, y), r)
            c.id = circles.length
            c.invMass = 1.0
            c.velocity = Zero
            circles.push(c)
        }

        function r() {
            return 0.15*Math.random() + 0.1
        }

        addLine(0, 2, 2, 0)
        addLine(2, 0, 5, 2)
        for (var i = 1; i < 6; i++) {
            addCircle(i, 4, r())
            addCircle(i, 5, r())
            addCircle(i, 6, r())
            }

        

        this.tick = function() {
            var contacts = []


            ctx.fillStyle = "white"
            ctx.fillRect(0,0,width,height)
            ctx.strokeStyle = "black"
            ctx.lineCap = "square"
            
            for (var i in circles) {
                circles[i].velocity = circles[i].velocity.add(gravity.scale(invDt))
            }

            for (var i in lines) {
                var line = lines[i]
                for (var j in circles) {
                    var circle = circles[j]
                    contacts = contacts.concat(
                        line.getContactsWithCircle(circle)
                        )
                }
            }

            for (var i in circles) {
                for (var j in circles) {
                    if (circles[i].id < circles[j].id) {
                        contacts = contacts.concat(
                            circles[i].getContactsWithCircle(circles[j])
                            )
                    }
                }
            }

            for (i = 0; i < 10; i++) {
                contacts.forEach(function (contact) {
                    contact.resolve()
                })
            }

            for (var i in circles) {
                circles[i].center = circles[i].center.add(circles[i].velocity.scale(invDt))
            }

            for (var i in lines) {
                lines[i].draw()
            }

            for (var i in circles) {
                circles[i].draw()
            }
        }
    }
})
