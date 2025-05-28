import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    studyTime: string;
    dailyGoal: number;
    avatar: string | null;
    avatarPreview: string | ArrayBuffer | null;
  }>({
    name: "",
    email: "",
    studyTime: "Mattina",
    dailyGoal: 2,
    avatar: null,
    avatarPreview: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Carica i dati salvati al montaggio del componente
  useEffect(() => {
    const savedData = localStorage.getItem("profileData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData((prev) => ({
        ...prev,
        ...parsedData,
      }));
    }
  }, []);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
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
          avatar: file.name, // Salviamo solo il nome per localStorage
          avatarPreview: reader.result,
        };
        setUserData(updatedData);
        // Salviamo immediatamente l'avatar
        localStorage.setItem(
          "profileData",
          JSON.stringify({
            ...updatedData,
            avatar: file.name, // Non possiamo salvare il file direttamente in localStorage
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

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Salva i dati in localStorage
    localStorage.setItem(
      "profileData",
      JSON.stringify({
        ...userData,
        avatar: userData.avatar, // Solo il nome del file
      })
    );
    alert("Modifiche salvate con successo!");
  };

  const handleLogout = () => {
    // Qui potresti voler pulire localStorage al logout
    // localStorage.removeItem('profileData');
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Il tuo nome"
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
