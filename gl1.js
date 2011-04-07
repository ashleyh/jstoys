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
    name: "gl1",
    contributors: "ash",
    constructor: function (ctx, width, height) {
        var app = this
        
        app.tris = []
        app.matrices = [[],[]]

        var MODELVIEW = 0
        var PROJECTION = 1

        app.matrixMode = MODELVIEW

        app.viewPort = function(x,y,w,h) {
            app.viewPortX = x
            app.viewPortY = y
            app.viewPortW = w
            app.viewPortH = h
        }

        app.loadIdentity = function() {
            app.loadMatrix([
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1
            ])
        }

        app.loadMatrix = function(matrix) {
            app.matrices[app.matrixMode] = matrix
        }

        
        app.multMatrix = function(b) {
            var newMat = []
            var a = app.matrices[app.matrixMode]
            for(var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++) {
                    var i = row*4
                    var j = col
                    var x = a[i  ]*b[j  ] + a[i+1]*b[j+4 ] +
                            a[i+2]*b[j+8] + a[i+3]*b[j+12]
                    newMat.push(x)
                }
            }
            app.matrices[app.matrixMode] = newMat
        }

        function unit3(v) {
            var n = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
            return [v[0]/n, v[1]/n, v[2]/n]
        }

        function cross(a,b) {
            return [a[1]*b[2] - a[2]*b[1],
                    a[2]*b[0] - a[0]*b[2],
                    a[0]*b[1] - a[1]*b[0]]
        }
        
        function applyMatrix(mat, v) {
            var out = new Array(4)
            out[0] = mat[0]*v[0] + mat[1]*v[1] + mat[2]*v[2] + mat[3]*v[3]
            out[1] = mat[4]*v[0] + mat[5]*v[1] + mat[6]*v[2] + mat[7]*v[3]
            out[2] = mat[8]*v[0] + mat[9]*v[1] + mat[10]*v[2] + mat[11]*v[3]
            out[3] = mat[12]*v[0] + mat[13]*v[1] + mat[14]*v[2] + mat[15]*v[3]
            return out
        }

        function transformPoint(point) {
            var q = applyMatrix(app.matrices[MODELVIEW], point)
            q = applyMatrix(app.matrices[PROJECTION], q)
            n = q[3]
            q[0] = (q[0]/n + 1)*(app.viewPortW/2)+app.viewPortX
            q[1] = (q[1]/n + 1)*(app.viewPortH/2)+app.viewPortY
            return q
        }

        app.perspective = function(fovy, aspect, zNear, zFar) {
            f = 1.0/Math.tan(fovy/2)
            d = zNear - zFar
            app.multMatrix([
                f/aspect, 0, 0,              0,
                0,        f, 0,              0,
                0,        0, (zFar+zNear)/d, (2*zFar*zNear)/d,
                0,        0, -1,             0
            ])
        }


        app.lookAt = function(
            eyeX, eyeY, eyeZ,
            centerX, centerY, centerZ,
            upX, upY, upZ
        ) {
            var F = [centerX - eyeX, centerY - eyeY, centerZ - eyeZ]
            var f = unit3(F)
            var up = unit3([upX,upY,upZ])
            var s = cross(f,up)
            var u = cross(s,f)
            var M = [
                 s[0],  s[1],  s[2], 0,
                 u[0],  u[1],  u[2], 0,
                -f[0], -f[1], -f[2], 0,
                    0,     0,     0, 1
                ]
            app.multMatrix(M)
            app.translate(-eyeX, -eyeY, -eyeZ)
        }

        app.rotate = function(angle, x, y, z) {
            /* unlike OpenGL, x,y,z must be a UNIT vector */
            c = Math.cos(angle)
            s = Math.sin(angle)
            c1 = 1-c

            app.multMatrix([
                x*x*c1 + c,   x*y*c1 - z*s, x*z*c1 + y*s, 0,
                y*x*c1 + z*s, y*y*c1 + c,   y*z*c1 - x*s, 0,
                x*z*c1 - y*s, y*z*c1 + x*s, z*z*c1 + c,   0, 
                0,            0,            0,            1
                ])
        }

        app.translate =  function(x,y,z) {
            app.multMatrix([
                1,0,0,x,
                0,1,0,y,
                0,0,1,z,
                0,0,0,1
            ])
        }

        app.viewPort(0,0,width,height)
        app.matrixMode = MODELVIEW
        app.loadIdentity()
        app.matrixMode = PROJECTION
        app.loadIdentity()
        app.perspective(50.0*2*Math.PI/360, width/height, 1, 10)
        app.lookAt(-2,-2,-2,0,0,0,0,0,1)


        var ures = 20
        var vres = 10
        var R = 1.0
        var r = 0.25

        function torus(u,v) {
            var ur = u*2.0*Math.PI/ures
            var vr = v*2.0*Math.PI/vres
            return [
                (R+r*Math.cos(vr))*Math.cos(ur),
                (R+r*Math.cos(vr))*Math.sin(ur),
                r*Math.sin(vr),
                1.0
            ] 
        }


        function cu(u) {
            var l = []
            for (var v = 0; v < vres; v++) {
                l.push(torus(u,v))
            }
            return l
        }

        function cv(v) {
            var l = []
            for (var u = 0; u < ures; u++) {
                l.push(torus(u,v))
            }
            return l
        }

/*        for (var u = 0; u < ures; u++) {
            app.tris.push(cu(u))
        }

        for (var v = 0; v < vres; v++) {
//                    app.polys.push(cv(v))
        }*/
        
        for (var u = 0; u < ures; u++) {
            for (var v = 0; v < vres; v++) {
                // these are oriented clockwise from outside
                app.tris.push([
                    torus(u,v),
                    torus(u, v+1),
                    torus(u+1, v+1)
                ])
                app.tris.push([
                    torus(u+1,v+1),
                    torus(u+1, v),
                    torus(u, v)
                ])
            }
        }

        app.backfaceCulling = false

        app.draw = function() {
            ctx.fillStyle = "#fff"
            ctx.fillRect(0,0,width,height)
            ctx.strokeStyle="#000"
            
            var tris = []

            for (i = 0; i < app.tris.length; i++) {
                var tri = app.tris[i]
                tris.push([
                    transformPoint(tri[0]),
                    transformPoint(tri[1]),
                    transformPoint(tri[2])
                ])
            }

/*
            tris.sort(function(t, u) {
                var tmax = Math.max(t[0][2], t[1][2], t[2][2])
                var umin = Math.min(u[0][2], u[1][2], u[2][2])
                return umin - tmax
            })*/

            for (i = 0; i < tris.length; i++) {
                tri = tris[i]
                // backface culling
                clock = ((tri[1][0]-tri[0][0])*(tri[2][1]-tri[0][1]) - 
                         (tri[2][0]-tri[0][0])*(tri[1][1]-tri[0][1]))
                if (clock <= 0 || !app.backfaceCulling) {
                    ctx.beginPath()
                    ctx.moveTo(tri[0][0], tri[0][1])
                    ctx.lineTo(tri[1][0], tri[1][1])
                    ctx.lineTo(tri[2][0], tri[2][1])
                    ctx.closePath()
                    //ctx.fill()
                    ctx.stroke()
                }
            }
        }
        
        app.update = function () {
            app.matrixMode = MODELVIEW
            t = 0.01
            app.rotate(t, 1,0,0)
            app.rotate(2*t, 0,1,0)
//            app.rotate(3*t, 0,0,1)

        }
        
        app.tick = function() {    
            app.update()
            app.draw()
        }
    }
})
