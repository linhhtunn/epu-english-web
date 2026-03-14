import React from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";

const ParentAttendance = () => {

  const attendanceData = [
    {
      date: "14/03/2026",
      time: "07:00 - 08:30",
      status: "present",
      note: "",
    },
    {
      date: "13/03/2026",
      time: "07:00 - 08:30",
      status: "present",
      note: "",
    },
    {
      date: "12/03/2026",
      time: "07:00 - 08:30",
      status: "late",
      note: "Đến lớp lúc 07:15",
    },
    {
      date: "11/03/2026",
      time: "07:00 - 08:30",
      status: "present",
      note: "",
    },
    {
      date: "10/03/2026",
      time: "07:00 - 08:30",
      status: "absent",
      note: "Vắng không phép",
    },
  ];

  const getStatus = (status) => {
    switch (status) {
      case "present":
        return <Badge bg="success">Có mặt</Badge>;
      case "late":
        return <Badge bg="warning">Đi muộn</Badge>;
      case "absent":
        return <Badge bg="danger">Vắng mặt</Badge>;
      default:
        return null;
    }
  };

  return (
    <Container className="mt-4">

      <h4 className="mb-4">Lịch sử điểm danh</h4>

      <Row className="mb-4">

        <Col md={3}>
          <Card className="text-center p-3 shadow-sm bg-primary text-white">
            <h6>Tổng buổi</h6>
            <h3>10</h3>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center p-3 shadow-sm bg-success text-white">
            <h6>Có mặt</h6>
            <h3>7</h3>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center p-3 shadow-sm bg-danger text-white">
            <h6>Vắng</h6>
            <h3>1</h3>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center p-3 shadow-sm bg-warning text-dark">
            <h6>Đi muộn</h6>
            <h3>2</h3>
          </Card>
        </Col>

      </Row>

      <Card className="shadow-sm">
        <Card.Body>

          <Table hover responsive>
            <thead>
              <tr>
                <th>Ngày học</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
              </tr>
            </thead>

            <tbody>
              {attendanceData.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{getStatus(item.status)}</td>
                  <td>{item.note || "—"}</td>
                </tr>
              ))}
            </tbody>

          </Table>

        </Card.Body>
      </Card>

    </Container>
  );
};

export default ParentAttendance;