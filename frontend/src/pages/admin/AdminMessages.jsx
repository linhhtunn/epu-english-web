import React, { useState, useEffect, useRef } from 'react';

const AdminMessages = () => {
    // --- 1. MOCK DATA ---
    const currentUser = { id: 'ADMIN', name: 'Hệ thống Admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=0d6efd&color=fff' };

    const contacts = [
        { id: 'GV01', name: 'Lan Anh', role: 'Giáo viên', avatar: 'https://ui-avatars.com/api/?name=Lan+Anh&background=198754&color=fff' },
        { id: 'GV02', name: 'Steven Dang', role: 'Giáo viên', avatar: 'https://ui-avatars.com/api/?name=Steven+Dang&background=198754&color=fff' },
        { id: 'PH01', name: 'Phụ huynh em Minh', role: 'Phụ huynh', avatar: 'https://ui-avatars.com/api/?name=PH+Minh&background=fd7e14&color=fff' },
        { id: 'PH02', name: 'Phụ huynh em Trang', role: 'Phụ huynh', avatar: 'https://ui-avatars.com/api/?name=PH+Trang&background=fd7e14&color=fff' },
        { id: 'GV03', name: 'Thu Hà', role: 'Giáo viên', avatar: 'https://ui-avatars.com/api/?name=Thu+Ha&background=198754&color=fff' }
    ];

    const initialConversations = [
        { 
            id: 'PH_02', isGroup: false, userId: 'PH02', name: 'Phụ huynh em Trang', role: 'Phụ huynh', 
            avatar: 'https://ui-avatars.com/api/?name=PH+Trang&background=fd7e14&color=fff',
            lastMessage: 'Gia đình gửi giấy khám bệnh của cháu ạ.', time: '13:01', unread: 2, isOnline: true
        },
        { 
            id: 'PH_01', isGroup: false, userId: 'PH01', name: 'Phụ huynh em Minh', role: 'Phụ huynh', 
            avatar: 'https://ui-avatars.com/api/?name=PH+Minh&background=fd7e14&color=fff',
            lastMessage: 'Cảm ơn trung tâm. Mình vừa chuyển khoản rồi nhé.', time: '09:15', unread: 1, isOnline: false
        },
        { 
            id: 'C1', isGroup: false, userId: 'GV01', name: 'Lan Anh', role: 'Giáo viên', 
            avatar: 'https://ui-avatars.com/api/?name=Lan+Anh&background=198754&color=fff',
            lastMessage: 'Tôi vừa gửi tệp báo cáo đính kèm nhé.', time: 'Hôm qua', unread: 0, isOnline: true
        },
        { 
            id: 'G1', isGroup: true, name: 'Tổ Tiếng Anh Trẻ Em', role: 'Nhóm (3 thành viên)', 
            avatar: 'https://ui-avatars.com/api/?name=TA&background=6f42c1&color=fff',
            lastMessage: 'Lan Anh: Mọi người nhớ lịch họp tuần này nhé.', time: 'Thứ 2', unread: 0, isOnline: false,
            members: ['ADMIN', 'GV01', 'GV03']
        }
    ];

    const dummyPdfData = 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCj4+CiAgPj4KICAvQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCgo0IDAgb2JqCjw8CiAgL1R5cGUgL0ZvbnQKICAvU3VidHlwZSAvVHlwZTEKICAvQmFzZUZvbnQgL1RpbWVzLVJvbWFuCj4+CmVuZG9iagoKNSAwIG9iago8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgpUagoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjggMDAwMDAgbiAKMDAwMDAwMDE2NyAwMDAwMCBuIAowMDAwMDAwMzE0IDAwMDAwIG4gCjAwMDAwMDA0MDkgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDk2CiUlRU9GCg==';
    
    const initialMessages = {
        'PH_02': [
            { id: 1, senderId: 'PH02', text: 'Admin ơi, hôm nay cháu Trang bị sốt cao, gia đình xin phép cho cháu nghỉ buổi học chiều nay nhé.', time: '13:00' },
            { id: 2, senderId: 'PH02', text: 'Gia đình gửi giấy khám bệnh của cháu ạ.', time: '13:01', attachments: [{ id: 'att2', type: 'file', url: dummyPdfData, name: 'Giay_Kham_Benh_Trang.pdf', size: '1.5 MB' }] }
        ],
        'PH_01': [
            { id: 1, senderId: 'PH01', text: 'Chào admin, cho mình hỏi học phí khóa IELTS tiếp theo của cháu Minh là bao nhiêu vậy ạ?', time: '08:00' },
            { id: 2, senderId: 'ADMIN', text: 'Dạ chào anh/chị, học phí khóa IELTS 6.5+ tiếp theo là 8.500.000 VNĐ ạ. Hạn đóng là trước ngày 10/03.', time: '08:30' },
            { id: 3, senderId: 'PH01', text: 'Cảm ơn trung tâm. Mình vừa chuyển khoản rồi nhé, admin kiểm tra giúp.', time: '09:15', attachments: [{ id: 'att1', type: 'image', url: 'https://placehold.co/400x600/0d6efd/white?text=Bien+Lai+Chuyen+Khoan', name: 'bien_lai.png', size: '500 KB' }] }
        ],
        'C1': [
            { id: 1, senderId: 'ADMIN', text: 'Chào cô Lan Anh, cô nhớ nộp báo cáo điểm danh.', time: '10:00' },
            { id: 2, senderId: 'GV01', text: 'Vâng, gửi Admin báo cáo của lớp PRI4 nhé.', time: '10:30', attachments: [{ id: 'att3', type: 'file', url: dummyPdfData, name: 'BaoCao_DiemDanh_PRI4.xlsx', size: '1.2 MB' }] }
        ],
        'G1': [
            { id: 1, senderId: 'ADMIN', text: 'Chào mọi người, đây là nhóm trao đổi chuyên môn nhé.', time: '09:00' },
            { id: 2, senderId: 'GV03', text: 'Chào Admin, tôi đã tham gia.', time: '09:15' },
            { id: 3, senderId: 'GV01', text: 'Mọi người nhớ lịch họp tuần này nhé.', time: '09:30' }
        ]
    };

    // --- 2. STATE QUẢN LÝ ---
    const [conversations, setConversations] = useState(initialConversations);
    const [messages, setMessages] = useState(initialMessages);
    const [activeChat, setActiveChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [messageInput, setMessageInput] = useState('');
    
    const [rightView, setRightView] = useState('empty');
    const [bulkRecipients, setBulkRecipients] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [memberSearchTerm, setMemberSearchTerm] = useState('');

    const [attachments, setAttachments] = useState([]); 
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    
    // Quản lý hiển thị Dropdown menu của mỗi cuộc trò chuyện
    const [dropdownOpen, setDropdownOpen] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        document.title = "Tin nhắn | EPU English";
        if (rightView === 'chat') scrollToBottom();
    }, [activeChat, messages, rightView, attachments]);

    // --- 3. HÀM TƯƠNG TÁC ---
    const handleFileSelect = (e, isImage) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newAttachments = files.map(file => ({
            id: Date.now() + Math.random(),
            file: file,
            url: URL.createObjectURL(file),
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 'file',
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        }));

        setAttachments(prev => [...prev, ...newAttachments]);
        e.target.value = null; 
    };

    const removeAttachment = (idToRemove) => {
        setAttachments(prev => prev.filter(att => att.id !== idToRemove));
    };

    const handleDownload = (attachment) => {
        const urlToDownload = attachment.url || attachment.file;
        if (!urlToDownload) return;
        const a = document.createElement('a');
        a.href = urlToDownload;
        a.download = attachment.name || 'TaiLieuDinhKem';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() && attachments.length === 0) return;

        if (rightView === 'broadcast') {
            alert(`Đã gửi thông báo hàng loạt!`);
            setMessageInput('');
            setAttachments([]);
            setRightView('empty');
            return;
        }

        const newMessage = {
            id: Date.now(),
            senderId: 'ADMIN',
            text: messageInput.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachments: attachments.length > 0 ? [...attachments] : null
        };

        setMessages({ ...messages, [activeChat]: [...(messages[activeChat] || []), newMessage] });

        let previewText = messageInput;
        if (!messageInput && attachments.length > 0) {
            previewText = attachments[0].type === 'image' ? '[Hình ảnh]' : '[Tệp đính kèm]';
        }
        
        const activeConv = conversations.find(c => c.id === activeChat);
        const prefix = activeConv.isGroup ? 'Bạn: ' : '';

        const updatedConversations = conversations.map(c => 
            c.id === activeChat ? { ...c, lastMessage: prefix + previewText, time: 'Vừa xong', unread: 0 } : c
        );
        const sortedConversations = [
            updatedConversations.find(c => c.id === activeChat),
            ...updatedConversations.filter(c => c.id !== activeChat)
        ];
        setConversations(sortedConversations);

        setMessageInput('');
        setAttachments([]);
    };

    const handleSelectChat = (chatId) => { 
        setRightView('chat'); 
        setActiveChat(chatId); 
        setConversations(conversations.map(c => c.id === chatId ? { ...c, unread: 0 } : c)); 
    };

    // --- HÀM XÓA CUỘC TRÒ CHUYỆN ---
    const handleDeleteChat = (e, chatId) => {
        e.stopPropagation(); // Ngăn không cho click vào đoạn chat
        if(window.confirm("Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?")) {
            setConversations(conversations.filter(c => c.id !== chatId));
            if (activeChat === chatId) {
                setActiveChat(null);
                setRightView('empty');
            }
        }
        setDropdownOpen(null);
    };

    const handleCreateGroup = () => {
        if (!newGroupName.trim() || selectedMembers.length === 0) { alert('Vui lòng nhập tên nhóm và chọn thành viên!'); return; }
        const newGroupId = 'G' + Date.now();
        const newGroup = {
            id: newGroupId, isGroup: true, name: newGroupName, role: `Nhóm (${selectedMembers.length + 1} thành viên)`, 
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newGroupName)}&background=6f42c1&color=fff`,
            lastMessage: 'Nhóm vừa được tạo.', time: 'Vừa xong', unread: 0, isOnline: false, members: ['ADMIN', ...selectedMembers]
        };
        setConversations([newGroup, ...conversations]);
        setMessages({ ...messages, [newGroupId]: [] });
        setNewGroupName(''); setSelectedMembers([]); setMemberSearchTerm(''); setActiveChat(newGroupId); setRightView('chat');
    };

    const toggleMemberSelection = (contactId) => { setSelectedMembers(prev => prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]); };
    const getSenderInfo = (senderId) => { return senderId === 'ADMIN' ? currentUser : (contacts.find(c => c.id === senderId) || { name: 'Người dùng', avatar: '' }); };
    
    const filteredConversations = conversations.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.role.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) || c.id.toLowerCase().includes(memberSearchTerm.toLowerCase()));

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = () => setDropdownOpen(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // --- 4. RENDER GIAO DIỆN ---
    return (
        <div className="d-flex h-100 bg-white rounded-4 shadow-sm overflow-hidden animate__animated animate__fadeIn" style={{ minHeight: '85vh', border: '1px solid #e9ecef' }}>
            
            {/* ================= CỘT TRÁI ================= */}
            <div className="d-flex flex-column border-end" style={{ width: '380px', backgroundColor: '#fdfdfd' }}>
                 <div className="p-4 pb-3 border-bottom bg-white z-index-1 shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>Tin nhắn</h4>
                        <div className="d-flex gap-2">
                            <button className={`btn btn-light rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center ${rightView === 'create_group' ? 'bg-primary text-white' : 'text-secondary hover-bg-gray'}`} 
                                    style={{ width: '38px', height: '38px' }} onClick={() => setRightView('create_group')} title="Tạo nhóm">
                                <i className="bi bi-person-plus-fill fs-5"></i>
                            </button>
                            <button className={`btn btn-light rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center ${rightView === 'broadcast' ? 'bg-primary text-white' : 'text-secondary hover-bg-gray'}`} 
                                    style={{ width: '38px', height: '38px' }} onClick={() => setRightView('broadcast')} title="Gửi hàng loạt">
                                <i className="bi bi-broadcast fs-5"></i>
                            </button>
                        </div>
                    </div>
                    <div className="position-relative">
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input type="text" className="form-control bg-light border-0 rounded-pill ps-5 py-2 shadow-none" 
                               placeholder="Tìm kiếm đoạn chat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-grow-1 p-3 pt-2 bg-white">
                    {filteredConversations.map(chat => (
                        <div key={chat.id} 
                             className={`position-relative d-flex align-items-center p-3 mb-2 rounded-4 cursor-pointer transition-all chat-item-card 
                             ${activeChat === chat.id && rightView === 'chat' ? 'bg-primary-subtle border border-primary-subtle shadow-sm' : 'border border-transparent hover-bg-light'}`} 
                             onClick={() => handleSelectChat(chat.id)}
                             onMouseLeave={() => setDropdownOpen(null)}>
                            
                            <div className="position-relative me-3 flex-shrink-0">
                                <img src={chat.avatar} className="rounded-circle shadow-sm border border-2 border-white" width="52" height="52" alt="avatar" />
                                {chat.isOnline && <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{ width: '14px', height: '14px' }}></span>}
                                {chat.isGroup && <span className="position-absolute top-0 start-100 translate-middle p-1 bg-purple border border-white rounded-circle shadow-sm"><i className="bi bi-people-fill text-white d-block" style={{fontSize: '9px', lineHeight: '1'}}></i></span>}
                            </div>
                            
                            <div className="flex-grow-1 min-w-0 pe-4">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <h6 className={`mb-0 text-truncate ${chat.unread > 0 ? 'fw-bolder text-dark' : 'fw-bold text-dark'}`} style={{ fontSize: '15px' }}>{chat.name}</h6>
                                    <span className={`small ${chat.unread > 0 ? 'text-primary fw-bold' : 'text-muted'}`} style={{ fontSize: '11px' }}>{chat.time}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className={`mb-0 small text-truncate pe-2 ${chat.unread > 0 ? 'fw-bold text-dark' : 'text-muted'}`} style={{ fontSize: '13px' }}>
                                        {chat.lastMessage}
                                    </p>
                                    {chat.unread > 0 && <span className="badge bg-danger rounded-pill shadow-sm">{chat.unread}</span>}
                                </div>
                            </div>

                            {/* Dropdown Xóa Chat */}
                            <div className="position-absolute end-0 top-50 translate-middle-y me-2 action-menu-btn" onClick={(e) => e.stopPropagation()}>
                                <button 
                                    className="btn btn-sm btn-light rounded-circle shadow-none text-muted" 
                                    onClick={(e) => { e.stopPropagation(); setDropdownOpen(dropdownOpen === chat.id ? null : chat.id); }}
                                >
                                    <i className="bi bi-three-dots"></i>
                                </button>
                                
                                {dropdownOpen === chat.id && (
                                    <div className="position-absolute end-0 mt-1 bg-white border rounded-3 shadow-lg p-1 z-index-2" style={{ minWidth: '150px' }}>
                                        <button className="btn btn-sm w-100 text-start text-danger hover-bg-light" onClick={(e) => handleDeleteChat(e, chat.id)}>
                                            <i className="bi bi-trash me-2"></i> Xóa đoạn chat
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredConversations.length === 0 && <div className="text-center text-muted mt-5 small fw-medium">Không tìm thấy kết quả phù hợp</div>}
                </div>
            </div>

            {/* ================= CỘT PHẢI ================= */}
            <div className="d-flex flex-column flex-grow-1 bg-white position-relative">
                
                {/* 1. VIEW: TRỐNG */}
                {rightView === 'empty' && (
                    <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted bg-light" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}>
                        <div className="bg-white p-5 rounded-circle shadow-sm mb-4">
                            <i className="bi bi-chat-square-text text-primary" style={{ fontSize: '4rem', opacity: 0.8 }}></i>
                        </div>
                        <h4 className="fw-bold text-dark">Trung tâm kết nối</h4>
                        <p className="text-muted">Chọn một cuộc trò chuyện từ danh sách hoặc bắt đầu đoạn chat mới.</p>
                    </div>
                )}

                {/* 2. VIEW: TẠO NHÓM CHAT */}
                {rightView === 'create_group' && (
                    <div className="h-100 d-flex flex-column bg-light animate__animated animate__fadeIn">
                        <div className="p-3 border-bottom bg-white shadow-sm d-flex align-items-center">
                            <i className="bi bi-people-fill text-primary fs-4 me-2"></i>
                            <div>
                                <h5 className="mb-0 fw-bold">Tạo nhóm chat mới</h5>
                                <span className="small text-muted">Thêm các thành viên vào nhóm để trao đổi chung.</span>
                            </div>
                        </div>
                        
                        <div className="p-4 flex-grow-1 overflow-y-auto custom-scrollbar">
                            <div className="card border-0 shadow-sm rounded-4 p-4 mx-auto bg-white" style={{ maxWidth: '600px' }}>
                                <div className="mb-4">
                                    <label className="fw-bold small text-dark mb-2">Tên nhóm chat:</label>
                                    <input type="text" className="form-control bg-light border-0 py-2 fw-medium" placeholder="VD: Tổ chuyên môn Tiếng Anh..." 
                                           value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
                                </div>
                                
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="fw-bold small text-dark mb-0">Chọn thành viên:</label>
                                        <span className="text-primary fw-bold small">{selectedMembers.length} đã chọn</span>
                                    </div>
                                    
                                    {/* THANH TÌM KIẾM THÀNH VIÊN */}
                                    <div className="input-group input-group-sm mb-3 border rounded-pill overflow-hidden bg-light">
                                        <span className="input-group-text bg-transparent border-0 pe-2"><i className="bi bi-search text-muted"></i></span>
                                        <input 
                                            type="text" 
                                            className="form-control bg-transparent border-0 shadow-none" 
                                            placeholder="Tìm kiếm theo Tên hoặc Mã GV/PH (VD: GV01)..." 
                                            value={memberSearchTerm} 
                                            onChange={(e) => setMemberSearchTerm(e.target.value)} 
                                        />
                                    </div>

                                    {/* DANH SÁCH THÀNH VIÊN ĐÃ LỌC */}
                                    <div className="border rounded-4 overflow-y-auto custom-scrollbar" style={{ maxHeight: '250px' }}>
                                        {filteredContacts.map(contact => (
                                            <div key={contact.id} 
                                                 className="d-flex justify-content-between align-items-center p-3 border-bottom hover-bg-light cursor-pointer transition-all"
                                                 onClick={() => toggleMemberSelection(contact.id)}>
                                                <div className="d-flex align-items-center">
                                                    <img src={contact.avatar} className="rounded-circle me-3" width="36" height="36" alt="avt"/>
                                                    <div>
                                                        <div className="fw-bold text-dark d-flex align-items-center gap-2" style={{fontSize: '14px'}}>
                                                            {contact.name} 
                                                            <span className="badge bg-secondary opacity-50 fw-normal" style={{ fontSize: '10px' }}>{contact.id}</span>
                                                        </div>
                                                        <div className="small text-muted" style={{fontSize: '12px'}}>{contact.role}</div>
                                                    </div>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input fs-5" type="checkbox" checked={selectedMembers.includes(contact.id)} readOnly />
                                                </div>
                                            </div>
                                        ))}
                                        {filteredContacts.length === 0 && (
                                            <div className="p-3 text-center text-muted small">Không tìm thấy người dùng nào phù hợp.</div>
                                        )}
                                    </div>
                                </div>

                                <button className="btn btn-primary rounded-pill fw-bold w-100 shadow-sm py-2 mt-2" onClick={handleCreateGroup}>
                                    <i className="bi bi-check-lg me-2"></i> Xác nhận tạo nhóm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. VIEW: BROADCAST */}
                {rightView === 'broadcast' && (
                    <div className="h-100 d-flex flex-column bg-light animate__animated animate__fadeIn">
                        <div className="p-3 border-bottom bg-white shadow-sm d-flex align-items-center">
                            <i className="bi bi-broadcast text-primary fs-4 me-2"></i>
                            <div>
                                <h5 className="mb-0 fw-bold">Gửi thông báo hàng loạt</h5>
                                <span className="small text-muted">Hệ thống sẽ gửi tin nhắn riêng lẻ đến từng người nhận.</span>
                            </div>
                        </div>
                        <div className="p-4 flex-grow-1">
                            <div className="card border-0 shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: '600px' }}>
                                <div className="mb-4">
                                    <label className="fw-bold small text-dark mb-2">Chọn nhóm người nhận:</label>
                                    <div className="d-flex gap-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="chkTeacher" onChange={(e) => setBulkRecipients(e.target.checked ? [...bulkRecipients, 'Giáo viên'] : bulkRecipients.filter(r => r !== 'Giáo viên'))} />
                                            <label className="form-check-label" htmlFor="chkTeacher">Tất cả Giáo viên</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="chkParent" onChange={(e) => setBulkRecipients(e.target.checked ? [...bulkRecipients, 'Phụ huynh'] : bulkRecipients.filter(r => r !== 'Phụ huynh'))} />
                                            <label className="form-check-label" htmlFor="chkParent">Tất cả Phụ huynh</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="fw-bold small text-dark mb-2">Nội dung thông báo:</label>
                                    <textarea className="form-control bg-light border-0 p-3 custom-scrollbar" rows="5" placeholder="Nhập nội dung thông báo chung..."
                                        value={messageInput} onChange={(e) => setMessageInput(e.target.value)}></textarea>
                                </div>
                                <button className="btn btn-primary rounded-pill fw-bold w-100 shadow-sm py-2" onClick={handleSendMessage}>
                                    <i className="bi bi-send-fill me-2"></i> Phát sóng thông báo
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. VIEW: CHAT CÁ NHÂN & NHÓM */}
                {rightView === 'chat' && activeChat && (() => {
                    const chatInfo = conversations.find(c => c.id === activeChat);
                    const chatMsgs = messages[activeChat] || [];
                    
                    return (
                        <div className="d-flex flex-column h-100 animate__animated animate__fadeIn">
                            
                            {/* Header Khung Chat */}
                            <div className="p-3 px-4 border-bottom d-flex justify-content-between align-items-center bg-white shadow-sm z-index-1">
                                <div className="d-flex align-items-center cursor-pointer">
                                    <img src={chatInfo.avatar} className="rounded-circle me-3 shadow-sm border border-2 border-white" width="46" height="46" alt="avatar" />
                                    <div>
                                        <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '-0.3px' }}>{chatInfo.name}</h5>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            {chatInfo.isOnline && !chatInfo.isGroup ? (
                                                <><span className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></span><span className="small text-success fw-medium" style={{ fontSize: '12px' }}>Đang hoạt động</span></>
                                            ) : (
                                                <span className="small text-muted fw-medium" style={{ fontSize: '12px' }}>{chatInfo.role}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex gap-3">
                                    <button className="btn btn-light rounded-circle text-primary shadow-sm hover-bg-gray d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><i className="bi bi-telephone-fill fs-5"></i></button>
                                    <button className="btn btn-light rounded-circle text-primary shadow-sm hover-bg-gray d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><i className="bi bi-camera-video-fill fs-5"></i></button>
                                    <div className="vr mx-1 opacity-25"></div>
                                    <button className="btn btn-light rounded-circle text-secondary shadow-sm hover-bg-gray d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><i className="bi bi-info-circle-fill fs-5"></i></button>
                                </div>
                            </div>

                            {/* Khu vực Lịch sử Tin nhắn */}
                            <div className="flex-grow-1 p-4 overflow-y-auto custom-scrollbar d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="text-center mb-4 mt-2">
                                    <span className="badge bg-white text-muted border px-3 py-2 shadow-sm fw-medium rounded-pill">Hôm nay</span>
                                </div>

                                {chatMsgs.map((msg, index) => {
                                    const isSelf = msg.senderId === 'ADMIN';
                                    const senderInfo = getSenderInfo(msg.senderId);
                                    const isSameSenderAsPrev = index > 0 && chatMsgs[index - 1].senderId === msg.senderId;

                                    return (
                                        <div key={msg.id} className={`d-flex mb-3 ${isSelf ? 'justify-content-end' : 'justify-content-start'}`}>
                                            {!isSelf && (
                                                <div style={{ width: '38px', marginRight: '10px' }}>
                                                    {!isSameSenderAsPrev && <img src={senderInfo.avatar} className="rounded-circle shadow-sm" width="36" height="36" alt="avt" />}
                                                </div>
                                            )}
                                            
                                            <div className="d-flex flex-column" style={{ maxWidth: '70%' }}>
                                                {!isSelf && chatInfo.isGroup && !isSameSenderAsPrev && (
                                                    <span className="small text-muted fw-bold ms-1 mb-1" style={{ fontSize: '12px' }}>{senderInfo.name}</span>
                                                )}

                                                {/* Xử lý ĐÍNH KÈM */}
                                                {msg.attachments && msg.attachments.map(att => (
                                                    <div key={att.id} className={`mb-1 ${isSelf ? 'text-end' : 'text-start'}`}>
                                                        {att.type === 'image' ? (
                                                            <div className="position-relative d-inline-block">
                                                                <img src={att.url || att.file} alt="attachment" className="rounded-4 shadow-sm border border-light cursor-pointer" 
                                                                     style={{ maxWidth: '280px', maxHeight: '280px', objectFit: 'cover' }} 
                                                                     onClick={() => window.open(att.url || att.file, '_blank')} />
                                                            </div>
                                                        ) : (
                                                            <div className={`d-inline-flex align-items-center p-3 rounded-4 shadow-sm border ${isSelf ? 'bg-primary text-white border-primary' : 'bg-white text-dark border-light'}`} style={{ minWidth: '240px' }}>
                                                                <div className={`rounded p-2 me-3 ${isSelf ? 'bg-white bg-opacity-25' : 'bg-light text-primary'}`}><i className="bi bi-file-earmark-text-fill fs-3"></i></div>
                                                                <div className="text-start me-4 flex-grow-1 min-w-0">
                                                                    <div className="fw-bold text-truncate" style={{ fontSize: '14px' }} title={att.name}>{att.name}</div>
                                                                    <div className="small opacity-75 mt-1" style={{ fontSize: '11px' }}>{att.size}</div>
                                                                </div>
                                                                <button 
                                                                    className={`btn btn-sm rounded-circle shadow-none hover-scale ${isSelf ? 'btn-light text-primary' : 'btn-primary text-white'}`}
                                                                    onClick={() => handleDownload(att)}
                                                                    title="Tải tệp này xuống"
                                                                >
                                                                    <i className="bi bi-download"></i>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Text */}
                                                {msg.text && (
                                                    <div className={`p-3 shadow-sm ${isSelf ? 'bg-primary text-white' : 'bg-white text-dark border border-light'}`}
                                                         style={{ 
                                                             borderRadius: isSelf ? '18px 18px 4px 18px' : '18px 18px 18px 4px', 
                                                             fontSize: '15px', 
                                                             lineHeight: '1.5' 
                                                         }}>
                                                        {msg.text}
                                                    </div>
                                                )}
                                                
                                                <div className={`d-flex align-items-center mt-1 ${isSelf ? 'justify-content-end me-1' : 'ms-1'}`}>
                                                    <span className="small text-muted" style={{ fontSize: '11px' }}>{msg.time}</span>
                                                    {isSelf && <i className="bi bi-check2-all text-primary ms-1 fs-6"></i>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* KHU VỰC NHẬP LIỆU */}
                            <div className="bg-white border-top p-3 px-4 position-relative">
                                {/* Preview đính kèm */}
                                {attachments.length > 0 && (
                                    <div className="d-flex gap-2 mb-3 pb-2 overflow-x-auto custom-scrollbar">
                                        {attachments.map(att => (
                                            <div key={att.id} className="position-relative border rounded-4 bg-light shadow-sm p-1 d-flex flex-column align-items-center justify-content-center" style={{ width: '90px', height: '90px', flexShrink: 0 }}>
                                                <button type="button" className="btn-close position-absolute top-0 end-0 bg-white border rounded-circle shadow-sm" style={{ transform: 'translate(30%, -30%)', padding: '5px' }} onClick={() => removeAttachment(att.id)}></button>
                                                {att.type === 'image' ? (
                                                    <img src={att.url} alt="prev" className="w-100 h-100 rounded-3 object-fit-cover" />
                                                ) : (
                                                    <div className="text-center p-2">
                                                        <i className="bi bi-file-earmark-pdf-fill fs-1 text-danger"></i>
                                                        <div className="text-truncate fw-medium mt-1 w-100" style={{ fontSize: '10px', maxWidth: '70px' }}>{att.name}</div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <form onSubmit={handleSendMessage} className="d-flex align-items-end gap-3 bg-light rounded-pill p-2 px-3 border shadow-sm">
                                    <input type="file" multiple ref={fileInputRef} className="d-none" onChange={(e) => handleFileSelect(e, false)} />
                                    <input type="file" multiple accept="image/*" ref={imageInputRef} className="d-none" onChange={(e) => handleFileSelect(e, true)} />

                                    <div className="d-flex gap-1 mb-1">
                                        <button type="button" className="btn btn-light rounded-circle text-primary shadow-none bg-transparent hover-bg-gray" title="Đính kèm tệp" onClick={() => fileInputRef.current.click()}>
                                            <i className="bi bi-paperclip fs-5"></i>
                                        </button>
                                        <button type="button" className="btn btn-light rounded-circle text-primary shadow-none bg-transparent hover-bg-gray" title="Gửi hình ảnh" onClick={() => imageInputRef.current.click()}>
                                            <i className="bi bi-image fs-5"></i>
                                        </button>
                                    </div>
                                    
                                    <textarea 
                                        className="form-control border-0 bg-transparent shadow-none custom-scrollbar py-2 fs-6" 
                                        placeholder={chatInfo.isGroup ? "Nhập tin nhắn tới nhóm..." : "Nhập tin nhắn..."} 
                                        rows="1"
                                        style={{ resize: 'none', maxHeight: '120px' }}
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                                    ></textarea>

                                    <button 
                                        type="submit" 
                                        className={`btn rounded-circle mb-1 ${messageInput.trim() || attachments.length > 0 ? 'btn-primary shadow-sm' : 'btn-secondary opacity-50 border-0'}`}
                                        disabled={!messageInput.trim() && attachments.length === 0}
                                        style={{ width: '42px', height: '42px', padding: '0', flexShrink: 0 }}
                                    >
                                        <i className="bi bi-send-fill fs-5"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    );
                })()}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .hover-bg-light:hover { background-color: #f8f9fa; }
                .hover-bg-gray:hover { background-color: #e9ecef !important; }
                .border-transparent { border-color: transparent !important; }
                .chat-item-card:hover { transform: translateX(2px); }
                .chat-item-card .action-menu-btn { opacity: 0; transition: opacity 0.2s; }
                .chat-item-card:hover .action-menu-btn { opacity: 1; }
                .cursor-pointer { cursor: pointer; }
                .transition-all { transition: all 0.2s ease-in-out; }
                .min-w-0 { min-width: 0; }
                .z-index-1 { z-index: 1; }
                .z-index-2 { z-index: 1050; }
                .bg-purple { background-color: #6f42c1 !important; }
                .hover-scale:hover { transform: scale(1.1); transition: 0.2s; }
            `}</style>
        </div>
    );
};

export default AdminMessages;