document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Cài đặt thông số 3D
    const FOCUS = 350; // Khoảng cách tiêu điểm (tầm nhìn)
    const PARTICLE_COUNT = 1500; // Số lượng hạt lấp lánh
    const HEART_SCALE = 150; // Kích thước cơ sở của trái tim

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // ---------------------------------------------
    // 1. Công thức Trái tim 3D (Parametric Heart Function)
    // ---------------------------------------------
    function getHeartCoordinates(t) {
        // Công thức Parametric Heart 2D
        const x = HEART_SCALE * (16 * Math.pow(Math.sin(t), 3));
        const y = HEART_SCALE * -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return { x, y };
    }

    // ---------------------------------------------
    // 2. Class Particle (Hạt)
    // ---------------------------------------------
    class Particle {
        constructor() {
            // Chọn một góc ngẫu nhiên trên trái tim 2D
            const t = Math.random() * (2 * Math.PI); 
            const coords2D = getHeartCoordinates(t);

            // Tọa độ 3D (x, y, z)
            this.x = coords2D.x + (Math.random() - 0.5) * 50; 
            this.y = coords2D.y + (Math.random() - 0.5) * 50;
            this.z = Math.random() * 500 - 250; // Vị trí Z từ -250 (xa) đến 250 (gần)

            this.initialSize = Math.random() * 1.5 + 0.5;
            this.speedZ = (Math.random() - 0.5) * 0.1;
            this.hue = 200 + Math.random() * 30; // Màu xanh dương/tuyết
        }

        update(time) {
            // Hiệu ứng "nhịp đập" và chuyển động nhẹ theo trục Z
            const pulse = 1 + Math.sin(time * 0.5) * 0.1;
            this.z += this.speedZ * pulse;
            
            // Xử lý hạt đi ra ngoài tầm nhìn (để tạo hiệu ứng liên tục)
            if (this.z < -FOCUS) this.z = 250; 
            if (this.z > FOCUS) this.z = -250;

            // Áp dụng Phép chiếu Phối cảnh (Projection)
            const perspective = FOCUS / (FOCUS + this.z);
            this.displayX = this.x * perspective + width / 2;
            this.displayY = this.y * perspective + height / 2;
            this.size = this.initialSize * perspective * 2; 

            // Lấp lánh (thay đổi độ sáng)
            this.brightness = 70 + Math.sin(time * 5 + this.z * 0.1) * 30;
        }

        draw() {
            // Độ trong suốt giảm dần khi hạt đi ra xa
            ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${1 - (this.z / FOCUS / 2)})`;
            ctx.beginPath();
            ctx.fillRect(this.displayX, this.displayY, this.size, this.size);
        }
    }

    let particlesArray = [];
    function initParticles() {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    // ---------------------------------------------
    // 3. Vòng lặp Animation
    // ---------------------------------------------
    let startTime = Date.now();

    function animate() {
        const time = (Date.now() - startTime) / 1000; 

        // Tạo hiệu ứng mờ (vệt sáng)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height); 

        // Sắp xếp hạt theo trục Z (vẽ từ xa đến gần)
        particlesArray.sort((a, b) => b.z - a.z);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update(time);
            particlesArray[i].draw();
        }

        requestAnimationFrame(animate);
    }

    animate();
    
    // ---------------------------------------------
    // 4. Logic Tương tác (cho các nút nav)
    // ---------------------------------------------
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Xử lý trạng thái active
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            // Đây là nơi bạn sẽ thêm logic điều hướng thực tế
            console.log(`Đã nhấn nút: ${item.textContent}`);
            alert(`Đã chuyển đến trang ${item.textContent.trim()}`);
        });
    });
});

