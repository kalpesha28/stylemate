import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

function Dashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/'); return }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(data)
      setLoading(false)
    }
    getProfile()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-purple-600 text-sm">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-4 fixed h-full">
        <div className="text-xl font-medium mb-8 px-2">
          Style<span className="text-purple-600">Mate</span>
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { icon: '▦', label: 'Dashboard', path: '/dashboard', active: true },
            { icon: '👕', label: 'My Wardrobe', path: '/wardrobe' },
            { icon: '✦', label: 'Outfit Builder', path: '/builder' },
            { icon: '★', label: 'Recommendations', path: '/recs' },
            { icon: '↗', label: 'Insights', path: '/insights' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all ${
                item.active
                  ? 'bg-purple-50 text-purple-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="bg-purple-50 text-purple-700 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
            ✦ AI Active
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-56 flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-medium">
              Good morning, {profile?.name} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {profile?.seasonal_type} · {profile?.skin_tone} skin tone
            </p>
          </div>
          <button
            onClick={() => navigate('/wardrobe')}
            className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
          >
            + Add clothes
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Items in wardrobe', value: '0' },
            { label: 'Saved outfits', value: '0' },
            { label: 'Avg style score', value: '—' },
            { label: 'Unused items', value: '0' },
          ].map(m => (
            <div key={m.label} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-1">{m.label}</div>
              <div className="text-2xl font-medium">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Color palette */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium">Your colour palette</span>
            <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full">
              ✦ {profile?.seasonal_type}
            </span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {profile?.seasonal_type?.includes('Autumn') && (
              ['#D85A30','#854F0B','#639922','#633806','#444441'].map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} className="w-9 h-9 rounded-full" />
              ))
            )}
            {profile?.seasonal_type?.includes('Spring') && (
              ['#F5C08A','#97C459','#EF9F27','#5DCAA5','#F0997B'].map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} className="w-9 h-9 rounded-full" />
              ))
            )}
            {profile?.seasonal_type?.includes('Summer') && (
              ['#85B7EB','#ED93B1','#AFA9EC','#5DCAA5','#B4B2A9'].map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} className="w-9 h-9 rounded-full" />
              ))
            )}
            {profile?.seasonal_type?.includes('Winter') && (
              ['#534AB7','#A32D2D','#2C2C2A','#185FA5','#D4537E'].map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} className="w-9 h-9 rounded-full" />
              ))
            )}
          </div>
        </div>

        {/* Empty state */}
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">👗</div>
          <div className="text-sm font-medium mb-1">Your wardrobe is empty</div>
          <div className="text-xs text-gray-400 mb-4">
            Add your first clothing item to get AI outfit recommendations
          </div>
          <button
            onClick={() => navigate('/wardrobe')}
            className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
          >
            + Add your first item
          </button>
        </div>

      </div>
    </div>
  )
}

export default Dashboard