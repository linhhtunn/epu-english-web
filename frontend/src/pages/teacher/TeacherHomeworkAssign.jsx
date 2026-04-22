import React, { useState, useEffect } from 'react';
import { teacherService } from '../../services/teacherService';

const TeacherHomeworkAssign = () => {
    const [homeworks, setHomeworks] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [filterClass, setFilterClass] = useState("all");

    // Form state
    const [newHomework, setNewHomework] = useState({
        maLop: "",
        maBaiTapGoc: "",
        hanNop: "",
        link: ""
    });

    useEffect(() => {
        document.title = "Giao bài tập | EPU English";
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [hwData, templateData, classData] = await Promise.all([
                teacherService.getAssignedHomeworks(),
                teacherService.getHomeworkTemplates(),
                teacherService.getClasses()
            ]);
            setHomeworks(hwData);
            setTemplates(templateData);
            setClasses(classData);
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu bài tập:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await teacherService.assignHomework(newHomework);
            alert("Đã giao bài tập thành công!");
            setShowAssignModal(false);
            fetchData();
        } catch (err) {
            alert("Lỗi khi giao bài tập");
        }
    };

    const handlePublish = async (id) => {
        if (!window.confirm("Bạn có chắc muốn duyệt và công khai bài tập này?")) return;
        try {
            await teacherService.publishHomework(id);
            alert("Đã công khai bài tập!");
            fetchData();
        } catch (err) {
            alert("Lỗi khi duyệt bài tập");
        }
    };

    const handleViewDetails = async (id) => {
        try {
            const details = await teacherService.getHomeworkDetails(id);
            setSelectedDetail(details);
            setShowDetailModal(true);
        } catch (err) {
            alert("Lỗi khi tải chi tiết bài tập");
        }
    };

    const filteredHomeworks = filterClass === "all" 
        ? homeworks 
        : homeworks.filter(h => h.classCode === filterClass);

    return (
        <div className="container-fluid p-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1 text-uppercase" style={{fontSize: '24px'}}>Giao bài tập</h2>
                    <p className="text-muted small">Quản lý và giao bài tập về nhà cho các lớp học</p>
                </div>
                <button 
                    className="btn btn-dark rounded-pill px-4 shadow-sm fw-bold"
                    onClick={() => setShowAssignModal(true)}
                >
                    <i className="bi bi-plus-lg me-2"></i> Giao bài mới
                </button>
            </div>

            {/* Filter & Stats */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">Lọc theo lớp</label>
                    <select 
                        className="form-select rounded-pill border-2"
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                    >
                        <option value="all">Tất cả các lớp</option>
                        {classes.map(c => (
                            <option key={c.maLop} value={c.maLopHienThi}>{c.maLopHienThi}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Tên bài tập</th>
                                    <th>Lớp</th>
                                    <th>Ngày giao</th>
                                    <th>Hạn nộp</th>
                                    <th>Trạng thái</th>
                                    <th>Nộp bài</th>
                                    <th className="text-end pe-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHomeworks.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted">Chưa có bài tập nào được giao.</td>
                                    </tr>
                                ) : (
                                    filteredHomeworks.map(hw => (
                                        <tr key={hw.maBaiTap}>
                                            <td className="ps-4">
                                                <div className="fw-bold">{hw.title}</div>
                                                <small className="text-muted"><i className="bi bi-link-45deg"></i> {hw.link || "N/A"}</small>
                                            </td>
                                            <td><span className="badge bg-primary-subtle text-primary">{hw.classCode}</span></td>
                                            <td className="small">{new Date(hw.ngayGiao).toLocaleDateString('vi-VN')}</td>
                                            <td className="small">{new Date(hw.hanNop).toLocaleDateString('vi-VN')}</td>
                                            <td>
                                                <span className={`badge rounded-pill ${hw.trangThai === 'Draft' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                    {hw.trangThai === 'Draft' ? 'Bản nháp' : 'Đã giao'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-primary">{hw.submissionCount} HS</div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="btn-group gap-2">
                                                    {hw.trangThai === 'Draft' && (
                                                        <button 
                                                            className="btn btn-sm btn-outline-success rounded-pill px-3"
                                                            onClick={() => handlePublish(hw.maBaiTap)}
                                                        >
                                                            Duyệt
                                                        </button>
                                                    )}
                                                    <button 
                                                        className="btn btn-sm btn-dark rounded-pill px-3"
                                                        onClick={() => handleViewDetails(hw.maBaiTap)}
                                                    >
                                                        Chi tiết
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Giao bài mới */}
            {showAssignModal && (
                <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Giao bài tập mới</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
                            </div>
                            <form onSubmit={handleAssign}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Lớp học</label>
                                        <select 
                                            className="form-select rounded-3" 
                                            required
                                            value={newHomework.maLop}
                                            onChange={e => setNewHomework({...newHomework, maLop: e.target.value})}
                                        >
                                            <option value="">Chọn lớp...</option>
                                            {classes.map(c => (
                                                <option key={c.maLop} value={c.maLop}>{c.maLopHienThi} - {c.courseName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Bài tập mẫu (Template)</label>
                                        <select 
                                            className="form-select rounded-3" 
                                            required
                                            value={newHomework.maBaiTapGoc}
                                            onChange={e => setNewHomework({...newHomework, maBaiTapGoc: e.target.value})}
                                        >
                                            <option value="">Chọn bài tập...</option>
                                            {templates.map(t => (
                                                <option key={t.maBaiTapGoc} value={t.maBaiTapGoc}>{t.tieuDe} ({t.courseName})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Hạn nộp</label>
                                        <input 
                                            type="date" 
                                            className="form-control rounded-3" 
                                            required
                                            value={newHomework.hanNop}
                                            onChange={e => setNewHomework({...newHomework, hanNop: e.target.value})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Link bài tập (Nếu có)</label>
                                        <input 
                                            type="url" 
                                            className="form-control rounded-3" 
                                            placeholder="https://..."
                                            value={newHomework.link}
                                            onChange={e => setNewHomework({...newHomework, link: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowAssignModal(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-dark rounded-pill px-4">Giao bài</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Chi tiết nộp bài */}
            {showDetailModal && selectedDetail && (
                <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header">
                                <div>
                                    <h5 className="modal-title fw-bold">{selectedDetail.title}</h5>
                                    <p className="text-muted small mb-0">Lớp {selectedDetail.classCode} • Hạn nộp: {new Date(selectedDetail.hanNop).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
                            </div>
                            <div className="modal-body p-0">
                                <div className="bg-light p-3 d-flex gap-3 text-center border-bottom">
                                    <div className="flex-fill">
                                        <small className="text-muted d-block">Tổng số HS</small>
                                        <span className="fw-bold">{selectedDetail.stats.total}</span>
                                    </div>
                                    <div className="flex-fill text-success">
                                        <small className="text-muted d-block">Đã nộp</small>
                                        <span className="fw-bold">{selectedDetail.stats.submitted}</span>
                                    </div>
                                    <div className="flex-fill text-danger">
                                        <small className="text-muted d-block">Chưa nộp</small>
                                        <span className="fw-bold">{selectedDetail.stats.pending}</span>
                                    </div>
                                </div>
                                <div className="list-group list-group-flush">
                                    {selectedDetail.students.map(s => (
                                        <div key={s.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                            <div>
                                                <div className="fw-bold">{s.name}</div>
                                                {s.hasSubmitted ? (
                                                    <small className="text-success"><i className="bi bi-check-circle me-1"></i> Đã nộp lúc {new Date(s.submissionDate).toLocaleString('vi-VN')}</small>
                                                ) : (
                                                    <small className="text-danger"><i className="bi bi-clock-history me-1"></i> Chưa nộp bài</small>
                                                )}
                                            </div>
                                            {s.hasSubmitted && (
                                                <span className={`badge ${s.score ? 'bg-primary' : 'bg-warning text-dark'}`}>
                                                    {s.score ? `Điểm: ${s.score}` : 'Chưa chấm'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-dark rounded-pill px-4" onClick={() => setShowDetailModal(false)}>Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherHomeworkAssign;
