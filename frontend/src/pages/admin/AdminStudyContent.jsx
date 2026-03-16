import React from 'react';
import { BookOpen, Folder, FileText, Download, Clock, Eye } from 'lucide-react';

const AdminStudyContent = () => {
  // Dữ liệu mẫu (sẽ được thay bằng API sau này)
  const data = [
  {
    maChuong: 1,
    tenChuong: "IELTS Speaking - Chapter 1",
    taiLieu: [
      { 
        id: 1, 
        ten: "Vocabulary: Hobbies & Interests", 
        size: "1.2 MB", 
        date: "15/03/2026", 
        loai: "PDF", 
        link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" // Link PDF mẫu
      },
      { 
        id: 2, 
        ten: "Audio: Common Speaking Topics", 
        size: "8.5 MB", 
        date: "14/03/2026", 
        loai: "MP3", 
        link: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Link MP3 mẫu
      }
    ]
  },
  {
    maChuong: 2,
    tenChuong: "English Grammar - Tenses",
    taiLieu: [
      { id: 3, ten: "Handout: Past Simple vs Present Perfect", size: "900 KB", date: "10/03/2026", loai: "PDF" },
      { id: 4, ten: "Video: Master the Future Tenses", size: "45 MB", date: "05/03/2026", loai: "MP4" }
    ]
  },
  {
    maChuong: 3,
    tenChuong: "Business English Writing",
    taiLieu: [
      { id: 5, ten: "Template: Professional Email", size: "500 KB", date: "01/03/2026", loai: "DOCX" }
    ]
  }
];

  return (
    <div className="container-fluid p-4">
      {/* Phần Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
        <div className="bg-primary bg-opacity-10 text-primary rounded p-3 me-3 d-flex align-items-center justify-content-center">
          <BookOpen size={32} />
        </div>
        <div>
          <h2 className="mb-1 fw-bold text-dark">Nội dung học tập</h2>
          <span className="text-muted small">Quản lý và xem trước toàn bộ tài liệu giảng dạy </span>
        </div>
      </div>

      {/* Phần Danh sách Chương và Tài liệu */}
      <div className="row">
        {data.map((chapter) => (
          <div key={chapter.maChuong} className="col-12 mb-4">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              
              {/* Tiêu đề chương học */}
              <div className="card-header bg-light border-bottom-0 pt-3 pb-3 d-flex align-items-center">
                <Folder className="text-warning me-2" size={24} style={{ fill: '#ffc107' }} />
                <h5 className="mb-0 fw-bold text-dark">{chapter.tenChuong}</h5>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 ms-auto rounded-pill px-3 py-2">
                  {chapter.taiLieu.length} tài liệu
                </span>
              </div>

              {/* Bảng danh sách tài liệu */}
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small">
                      <tr>
                        <th className="ps-4 py-3 border-0">Tên tài liệu</th>
                        <th className="border-0">Định dạng</th>
                        <th className="border-0">Dung lượng</th>
                        <th className="border-0">Ngày cập nhật</th>
                        <th className="text-end pe-4 border-0">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chapter.taiLieu.map((doc) => (
                        <tr key={doc.id}>
                          <td className="ps-4 py-3 border-light">
                            <div className="d-flex align-items-center">
                              <div className="bg-light p-2 rounded-3 me-3 text-primary">
                                <FileText size={20} />
                              </div>
                              <span className="fw-semibold text-dark">{doc.ten}</span>
                            </div>
                          </td>
                          <td className="border-light">
                            <span className="badge bg-secondary bg-opacity-10 text-secondary px-2 py-1">
                              {doc.loai}
                            </span>
                          </td>
                          <td className="text-muted small border-light">{doc.size}</td>
                          <td className="text-muted small border-light">
                            <Clock size={14} className="me-1 mb-1" />
                            {doc.date}
                          </td>
                          <td className="text-end pe-4 border-light">
                           <a 
                            href={doc.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-sm btn-outline-primary me-2 rounded-3 px-3"
                            >
                            <Eye size={16} className="me-1 mb-1" /> Xem
                            </a>
                            <a 
                            href={doc.link} 
                            download // Thuộc tính này ép trình duyệt tải về thay vì mở
                            className="btn btn-sm btn-primary rounded-3 px-3"
                            >
                            <Download size={16} className="me-1 mb-1" /> Tải
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStudyContent;