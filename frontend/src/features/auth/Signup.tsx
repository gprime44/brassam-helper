import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { authApi } from '../../services/api';
import './Auth.css';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await authApi.signup({ username, email, password });
      login(response);
      navigate('/');
    } catch (err) {
      setError('Erreur lors de la création du compte. L\'email ou le pseudo est peut-être déjà utilisé.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <header className="auth-header">
          <div className="auth-logo">🍻</div>
          <h2>Rejoindre Brassam</h2>
          <p>Commencez à créer vos meilleures recettes.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Pseudo</label>
            <input
              type="text"
              id="username"
              placeholder="Votre pseudo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              placeholder="8 caractères minimum"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <small className="form-hint">8 caractères minimum</small>
          </div>
          
          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <footer className="auth-footer">
          Déjà un brasseur ? <Link to="/login">Se connecter</Link>
        </footer>
      </div>
    </div>
  );
};

export default Signup;
