import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [userData, setUserData] = useState<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    studyTime: string;
    dailyGoal: number;
    avatar: string | null;
    avatarPreview: string | ArrayBuffer | null;
  }>({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    userType: "HIGH_SCHOOL_STUDENT",
    studyTime: "Mattina",
    dailyGoal: 2,
    avatar: null,
    avatarPreview: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Carica i dati salvati al montaggio del componente
  useEffect(() => {
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData((prev) => ({
        ...prev,
        ...parsedData,
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedData = {
          ...userData,
          avatar: file.name,
          avatarPreview: reader.result,
        };
        setUserData(updatedData);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...updatedData,
            avatar: file.name,
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Salva i dati in localStorage
      localStorage.setItem("userData", JSON.stringify(userData));

      // Se è stata cambiata la password, gestisci il cambio
      if (passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword) {
        // Qui dovresti implementare la chiamata API per cambiare la password
        // await changePassword(passwordData.currentPassword, passwordData.newPassword);

        // Reset dei campi password dopo il cambio
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }

      alert("Modifiche salvate con successo!");
    } catch (error) {
      alert("Errore durante il salvataggio delle modifiche");
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profilo Personale</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Logout
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sezione Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                    {userData.avatarPreview ? (
                      typeof userData.avatarPreview === "string" ? (
                        <img src={userData.avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : null
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                </div>
                <p className="text-sm text-gray-500">Clicca sull'icona per cambiare la tua foto profilo</p>
              </div>

              {/* Sezione Informazioni Personali */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Informazioni Personali</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userData.username}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Il tuo username"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="la.tua.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Il tuo nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Cognome
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Il tuo cognome"
                    />
                  </div>
                  <div>
                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo Utente
                    </label>
                    <select
                      id="userType"
                      name="userType"
                      value={userData.userType}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                      <option value="HIGH_SCHOOL_STUDENT">Studente scuola superiore</option>
                      <option value="UNIVERSITY_STUDENT">Studente universitario</option>
                      <option value="PUBLIC_EXAM_CANDIDATE">Concorsista</option>
                      <option value="OTHER">Altro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sezione Cambio Password */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Cambio Password</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Password Attuale
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="La tua password attuale"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Nuova Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="La tua nuova password"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Conferma Nuova Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Conferma la nuova password"
                    />
                  </div>
                </div>
              </div>

              {/* Sezione Preferenze di Studio */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Preferenze di Studio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="studyTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Orario di Studio Preferito
                    </label>
                    <select
                      id="studyTime"
                      name="studyTime"
                      value={userData.studyTime}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                      <option>Mattina</option>
                      <option>Pomeriggio</option>
                      <option>Sera</option>
                      <option>Notte</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dailyGoal" className="block text-sm font-medium text-gray-700 mb-1">
                      Obiettivo Giornaliero di Studio (ore)
                    </label>
                    <input
                      type="number"
                      id="dailyGoal"
                      name="dailyGoal"
                      min="0"
                      max="24"
                      value={userData.dailyGoal}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Pulsante Salva */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Salva Modifiche
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
