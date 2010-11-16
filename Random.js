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

var Random = {}

Random.continuous = {
    uniform: function(a,b) {
        return a + (b-a)*Math.random()
    }
}

Random.discrete = {
    uniform: function(a,b) {
        var max = b+1
        var c = max
        while (c == max) {
            c = Random.continuous.uniform(a,max)
        }
        return Math.floor(c)
    }
}

Random.choose = function(xs) {
    return xs[Random.discrete.uniform(0, xs.length-1)]
}
