const theoriesData = [
  // --- I. CƠ HỌC ---
  {
    _id: 'theory_mechanics_01',
    title: 'Cơ học chất điểm: Động học (Chuyển động thẳng đều)',
    slug: 'co-hoc-chat-diem-dong-hoc-thang-deu',
    description: 'Khái niệm cơ bản, các công thức liên quan, và cách biểu diễn trên đồ thị của chuyển động thẳng đều.',
    content: `
      <h3>1. Khái niệm và Công thức</h3>
      <p>Chuyển động thẳng đều là chuyển động có quỹ đạo là đường thẳng và vận tốc không đổi theo thời gian.</p>
      <p>Phương trình chuyển động: $x = x_0 + vt$</p>
      <p>Trong đó:</p>
      <ul>
        <li>$x_0$ là tọa độ ban đầu (m)</li>
        <li>$v$ là vận tốc (m/s) (hằng số)</li>
        <li>$t$ là thời gian (s)</li>
        <li>$x$ là tọa độ của vật tại thời điểm $t$ (m)</li>
      </ul>
      <h3>2. Đồ thị chuyển động</h3>
      <p>Đồ thị tọa độ - thời gian ($x-t$) là một đường thẳng.</p>
      <p>Đồ thị vận tốc - thời gian ($v-t$) là một đường thẳng song song với trục thời gian.</p>
      <p><em>(Nội dung chi tiết hơn về ví dụ, bài tập minh họa sẽ được cập nhật sau)</em></p>
    `,
    topic: 'Cơ học',
    createdAt: new Date('2024-06-25T10:00:00Z'),
  },
  {
    _id: 'theory_mechanics_02',
    title: 'Cơ học chất điểm: Động học (Chuyển động thẳng biến đổi đều)',
    slug: 'co-hoc-chat-diem-dong-hoc-bien-doi-deu',
    description: 'Gia tốc, công thức tính vận tốc và quãng đường, phân tích đồ thị chuyển động thẳng biến đổi đều.',
    content: `
      <h3>1. Gia tốc</h3>
      <p>Gia tốc $a$ là đại lượng đặc trưng cho sự biến đổi vận tốc, $a = \\frac{\\Delta v}{\\Delta t}$.</p>
      <h3>2. Công thức</h3>
      <ul>
        <li>Vận tốc: $v = v_0 + at$</li>
        <li>Quãng đường: $s = v_0t + \\frac{1}{2}at^2$</li>
        <li>Phương trình độc lập thời gian: $v^2 - v_0^2 = 2as$</li>
      </ul>
      <p><em>(Nội dung chi tiết hơn sẽ được cập nhật sau)</em></p>
    `,
    topic: 'Cơ học',
    createdAt: new Date('2024-06-25T10:05:00Z'),
  },
  {
    _id: 'theory_mechanics_03',
    title: 'Cơ học chất điểm: Động học (Rơi tự do)',
    slug: 'co-hoc-chat-diem-dong-hoc-roi-tu-do',
    description: 'Đặc điểm của chuyển động rơi tự do và các công thức áp dụng.',
    content: `
      <p>Rơi tự do là chuyển động của vật chỉ chịu tác dụng của trọng lực.</p>
      <p>Gia tốc rơi tự do $g \\approx 9.8 \\text{ m/s}^2$ (hoặc $10 \\text{ m/s}^2$).</p>
      <p><em>(Nội dung chi tiết hơn sẽ được cập nhật sau)</em></p>
    `,
    topic: 'Cơ học',
    createdAt: new Date('2024-06-25T10:10:00Z'),
  },
  {
    _id: 'theory_mechanics_04',
    title: 'Động lực học chất điểm: Các định luật Newton',
    slug: 'dong-luc-hoc-dinh-luat-newton',
    description: 'Nghiên cứu sâu về Định luật I, II, III của Newton và ứng dụng trong các bài toán về lực và chuyển động.',
    content: `<p>Định luật I, II, III Newton và các bài toán ứng dụng.</p>`,
    topic: 'Cơ học',
    createdAt: new Date('2024-06-25T10:15:00Z'),
  },
  {
    _id: 'theory_mechanics_05',
    title: 'Động lực học chất điểm: Các loại lực',
    slug: 'dong-luc-hoc-cac-loai-luc',
    description: 'Tìm hiểu về lực hấp dẫn, trọng lực, lực ma sát, lực đàn hồi và nguyên lí chồng chất lực.',
    content: `<p>Chi tiết về các loại lực và nguyên lý chồng chất lực.</p>`,
    topic: 'Cơ học',
    createdAt: new Date('2024-06-25T10:20:00Z'),
  },
  {
    _id: 'theory_mechanics_06',
    title: 'Công - Năng lượng - Công suất',
    slug: 'cong-nang-luong-cong-suat',
    description: 'Phân biệt công phát động, công cản, công suất, động năng, thế năng (trọng trường, đàn hồi) và định luật bảo toàn cơ năng.',
    content: `<p>Công, năng lượng, công suất và các định luật bảo toàn năng lượng.</p>`,
    topic: 'Cơ học',
    createdAt: new Date('2024-06-25T10:25:00Z'),
  },
  {
    _id: 'theory_mechanics_07',
    title: 'Hệ vật - Va chạm: Động lượng và Va chạm mềm',
    slug: 'he-vat-va-cham-dong-luong',
    description: 'Khái niệm động lượng, định luật bảo toàn động lượng và tập trung vào va chạm mềm.',
    content: `<p>Động lượng và ứng dụng trong va chạm.</p>`,
    topic: 'Cơ học',
    createdAt: new Date('2024-06-25T10:30:00Z'),
  },
  {
    _id: 'theory_mechanics_08',
    title: 'Dao động cơ: Dao động điều hòa',
    slug: 'dao-dong-co-dieu-hoa',
    description: 'Khái niệm, phương trình, vận tốc, gia tốc, chu kì, tần số, biên độ, pha ban đầu và đồ thị dao động điều hòa.',
    content: `<p>Các đặc trưng của dao động điều hòa.</p>`,
    topic: 'Cơ học',
    createdAt: new Date('2024-06-25T10:35:00Z'),
  },
  {
    _id: 'theory_mechanics_09',
    title: 'Dao động cơ: Con lắc lò xo và Con lắc đơn',
    slug: 'dao-dong-co-con-lac-lo-xo-don',
    description: 'Nghiên cứu về chu kì và các dạng năng lượng của con lắc lò xo và con lắc đơn.',
    content: `<p>Chi tiết về con lắc lò xo và con lắc đơn.</p>`,
    topic: 'Cơ học',
    createdAt: new Date('2024-06-25T10:40:00Z'),
  },
  {
    _id: 'theory_mechanics_10',
    title: 'Dao động cơ: Các loại dao động và Cộng hưởng',
    slug: 'dao-dong-co-cac-loai-va-cong-huong',
    description: 'Phân biệt dao động tắt dần, dao động cưỡng bức, và hiện tượng cộng hưởng.',
    content: `<p>Các hiện tượng dao động phổ biến.</p>`,
    topic: 'Cơ học',
    createdAt: new Date('2024-06-25T10:45:00Z'),
  },

  // --- II. NHIỆT HỌC ---
  {
    _id: 'theory_thermo_01',
    title: 'Cấu tạo chất và thuyết động học phân tử',
    slug: 'cau-tao-chat-thuyet-dong-hoc-phan-tu',
    description: 'Đặc điểm các thể của vật chất (rắn, lỏng, khí) và mối quan hệ giữa động năng trung bình của phân tử chất khí với nhiệt độ.',
    content: `<p>Các thể của vật chất và động năng phân tử.</p>`,
    topic: 'Nhiệt học',
    createdAt: new Date('2024-06-25T10:50:00Z'),
  },
  {
    _id: 'theory_thermo_02',
    title: 'Các quá trình nhiệt động của khí lí tưởng',
    slug: 'qua-trinh-nhiet-dong-khi-li-tuong',
    description: 'Định nghĩa khí lí tưởng, phương trình trạng thái, các quá trình đẳng nhiệt, đẳng tích, đẳng áp và đồ thị liên quan.',
    content: `<p>Các quá trình nhiệt động cơ bản của khí lí tưởng.</p>`,
    topic: 'Nhiệt học',
    createdAt: new Date('2024-06-25T10:55:00Z'),
  },
  {
    _id: 'theory_thermo_03',
    title: 'Nguyên lí I Nhiệt động lực học',
    slug: 'nguyen-li-i-nhiet-dong-luc-hoc',
    description: 'Nội năng, công, nhiệt lượng, quy ước dấu và vận dụng công thức ΔU=Q+A.',
    content: `<p>Nguyên lí I Nhiệt động lực học và vận dụng.</p>`,
    topic: 'Nhiệt học',
    createdAt: new Date('2024-06-25T11:00:00Z'),
  },
  {
    _id: 'theory_thermo_04',
    title: 'Các hiện tượng chuyển thể',
    slug: 'cac-hien-tuong-chuyen-the',
    description: 'Nóng chảy, nhiệt nóng chảy riêng, nhiệt dung riêng, phương trình cân bằng nhiệt và khối lượng riêng của vật chất.',
    content: `<p>Chi tiết về các hiện tượng chuyển thể.</p>`,
    topic: 'Nhiệt học',
    createdAt: new Date('2024-06-25T11:05:00Z'),
  },

  // --- III. ĐIỆN HỌC - ĐIỆN TỪ HỌC ---
  {
    _id: 'theory_electric_01',
    title: 'Dòng điện không đổi: Khái niệm và Định luật Ohm',
    slug: 'dong-dien-khong-doi-khai-niem-dinh-luat-ohm',
    description: 'Cường độ dòng điện, điện lượng, vai trò nguồn điện, định luật Ohm cho đoạn mạch và điện trở suất.',
    content: `<p>Các khái niệm cơ bản về dòng điện không đổi.</p>`,
    topic: 'Điện học - Điện từ học',
    createdAt: new Date('2024-06-25T11:10:00Z'),
  },
  {
    _id: 'theory_electric_02',
    title: 'Dòng điện không đổi: Định luật Ohm cho toàn mạch',
    slug: 'dong-dien-khong-doi-dinh-luat-ohm-toan-mach',
    description: 'Nghiên cứu về suất điện động, điện trở trong của nguồn và mạch ngoài.',
    content: `<p>Định luật Ohm cho toàn mạch và các yếu tố liên quan.</p>`,
    topic: 'Điện học - Điện từ học',
    createdAt: new Date('2024-06-25T11:15:00Z'),
  },
  {
    _id: 'theory_electric_03',
    title: 'Dòng điện không đổi: Ghép điện trở',
    slug: 'dong-dien-khong-doi-ghep-dien-tro',
    description: 'Cách ghép nối tiếp, song song và hỗn hợp các điện trở, áp dụng cho các mạch phức tạp.',
    content: `<p>Các phương pháp ghép điện trở trong mạch điện.</p>`,
    topic: 'Điện học - Điện từ học',
    createdAt: new Date('2024-06-25T11:20:00Z'),
  },
  {
    _id: 'theory_electric_04',
    title: 'Dòng điện không đổi: Công và công suất điện',
    slug: 'dong-dien-khong-doi-cong-cong-suat',
    description: 'Khái niệm công suất điện, công suất tỏa nhiệt (Định luật Joule-Lenz) và điện năng tiêu thụ.',
    content: `<p>Công và công suất trong mạch điện.</p>`,
    topic: 'Điện học - Điện từ học',
    createdAt: new Date('2024-06-25T11:25:00Z'),
  },
  {
    _id: 'theory_electric_05',
    title: 'Dòng điện không đổi: Bài toán cực trị điện trở',
    slug: 'dong-dien-khong-doi-cuc-tri-dien-tro',
    description: 'Các dạng bài toán cực trị như xác định giá trị điện trở để cường độ dòng điện mạch chính nhỏ nhất.',
    content: `<p>Phương pháp giải các bài toán cực trị về điện trở.</p>`,
    topic: 'Điện học - Điện từ học',
    createdAt: new Date('2024-06-25T11:30:00Z'),
  },
];

module.exports = theoriesData;
