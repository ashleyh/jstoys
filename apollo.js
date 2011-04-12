/*
    Copyright 2011 Ashley Hewson

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
    name: "apollo",
    contributors: "ash",
    constructor: function (ctx, width, height) {
        function Circle(x, y, r) {
            this.x = x
            this.y = y
            this.r = r
        }

        Circle.prototype.draw = function() {
            ctx.beginPath()
            ctx.arc(this.x, this.y, Math.abs(this.r), 0, 2*Math.PI, true)
            ctx.stroke()
        }

        function Gap(c1, c2, c3) {
            this.c1 = c1
            this.c2 = c2
            this.c3 = c3
        }

        Gap.prototype.fill = function() {
            var x1 = this.c1.x,
                y1 = this.c1.y,
                r1 = this.c1.r,
                x2 = this.c2.x,
                y2 = this.c2.y,
                r2 = this.c2.r,
                x3 = this.c3.x,
                y3 = this.c3.y,
                r3 = this.c3.r
            
            var m11 = 2*(x2 - x1),
                m12 = 2*(y2 - y1),
                m13 = 2*(r1 - r2),
                m21 = 2*(x3 - x1),
                m22 = 2*(y3 - y1),
                m23 = 2*(r1 - r3),
                m31 = 2*(x3 - x2),
                m32 = 2*(y3 - y2),
                m33 = 2*(r2 - r3)
            
            var v1 = x2*x2-x1*x1 + y2*y2-y1*y1 + r1*r1-r2*r2,
                v2 = x3*x3-x1*x1 + y3*y3-y1*y1 + r1*r1-r3*r3,
                v3 = x3*x3-x2*x2 + y3*y3-y2*y2 + r2*r2-r3*r3
            
            var m = [
                [m11,m12,m13,v1],
                [m21,m22,m23,v2],
                [m31,m32,m33,v3]
                ]


            function swapRow(i, j) {
                var temp = m[i]
                m[i] = m[j]
                m[j] = temp
            }

            function subtract(i) {
                if (m[i][i] != 0) {
                    var temp = m[i][i]
                    m[i][0] /= temp
                    m[i][1] /= temp
                    m[i][2] /= temp
                    m[i][3] /= temp
                    console.log(m)
                    for (var row = 0; row < 3; row++) {
                        if (row != i) {
                            temp = m[row][i]
                            m[row][0] -= temp*m[i][0]
                        console.log(row, m)
                            m[row][1] -= temp*m[i][1]
                        console.log(row, m)
                            m[row][2] -= temp*m[i][2]
                        console.log(row, m)
                            m[row][3] -= temp*m[i][3]
                        console.log(row, m)
                        }
                    }
                }
            }

            console.log(m)
            if (m[1][0] != 0) {
                swapRow(0,1)
            } else if (m[2][0] != 0) {
                swapRow(0,2)
            }

            console.log(m)
            subtract(0)

            console.log(m)
            if (m[2][1] != 0) {
                swapRow(1,2)
            }

            console.log(m)
            subtract(1)
            console.log(m)
            subtract(2)
            console.log(m)
        }

        var circles = [
            new Circle(360, 360, -360),
            new Circle(180, 360, 180),
            new Circle(540, 360, 180),
            new Circle(360, 120, 120),
            new Circle(360, 600, 120)
            ]

        var gaps = [
            new Gap(circles[1], circles[2], circles[3])
            ]

        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, width, height)

        for (var i in circles) {
            circles[i].draw()
        }

        gaps[0].fill()
    }
})
