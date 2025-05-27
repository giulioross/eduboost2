function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Informazioni Personali</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Il tuo nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="la.tua.email@example.com"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Preferenze di Studio</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Orario di Studio Preferito</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Mattina</option>
                  <option>Pomeriggio</option>
                  <option>Sera</option>
                  <option>Notte</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Obiettivo Giornaliero di Studio (ore)</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Salva Modifiche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
