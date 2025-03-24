import React, { useEffect, useState } from 'react';
import api from '../api';
import { Container, Table, Button, Spinner, Form, Row, Col } from 'react-bootstrap';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
  });

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users') 
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Kullanıcılar alınamadı', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    api.post('/users', newUser) 
      .then(() => {
        fetchUsers();
        setNewUser({ name: '', email: '', role: '' });
      })
      .catch((err) => console.error('Kullanıcı eklenemedi', err));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      api.delete(`/users/${id}`) 
        .then(() => fetchUsers())
        .catch((err) => console.error('Kullanıcı silinemedi', err));
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">👤 Kullanıcılar</h2>

      <Form onSubmit={handleAddUser} className="mb-4">
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Ad"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
          </Col>
          <Col>
            <Form.Control
              type="email"
              placeholder="E-posta"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Rol"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              required
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="success">Ekle</Button>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Veriler yükleniyor...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>E-posta</th>
              <th>Rol</th>
              <th>İşlem</th> 
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Sil
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UsersPage;