function del(index) {
if (isNaN(index) || index >= this.length) {
return false;
    }
for (var i = 0, n = 0; i < this.length; i++) {
if (this[i] != this[index]) {
this[n++] = this[i];
        }
    }
this.length -= 1;
};