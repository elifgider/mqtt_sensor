import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('Login işlemi geçici olarak devre dışı bırakıldı.');
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="text-center mb-4">🔐 Giriş Yap</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>E-posta</Form.Label>
          <Form.Control
            type="email"
            disabled
            required
            placeholder="email@example.com"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Şifre</Form.Label>
          <Form.Control
            type="password"
            disabled
            required
            placeholder="Şifreniz"
          />
        </Form.Group>

        <div className="d-grid">
          <Button variant="primary" type="submit" disabled>
            Giriş Yap
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default LoginPage;