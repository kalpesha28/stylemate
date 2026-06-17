import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const SKIN_TONES = [
  { color: '#FDDBB4', label: 'Fair', season: 'Cool Summer' },
  { color: '#F5C08A', label: 'Light', season: 'Cool Spring' },
  { color: '#E8A87C', label: 'Light medium', season: 'Warm Spring' },
  { color: '#C68642', label: 'Medium', season: 'Warm Autumn' },
  { color: '#8D5524', label: 'Tan', season: 'Deep Autumn' },
  { color: '#5C3317', label: 'Deep', season: 'Deep Winter' },
  { color: '#2E1503', label: 'Very deep', season: 'Deep Winter' },
]

const BODY_SHAPES = [
  { icon: '⬜', label: 'Rectangle' },
  { icon: '🔺', label: 'Inverted triangle' },
  { icon: '🔻', label: 'Triangle / Pear' },
  { icon: '⭕', label: 'Oval / Apple' },
  { icon: '⌛', label: 'Hourglass' },
]

function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    body_shape: '',
    skin_tone: '',
    seasonal_type: '',
  })

  function updateForm(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function nextStep() {
    if (step === 1) {
      if (!form.name || !form.email || !form.password) {
        setError('Please fill in all fields')
        return
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
    }
    if (step === 2 && !form.body_shape) {
      setError('Please select your body shape')
      return
    }
    if (step === 3 && !form.skin_tone) {
      setError('Please select your skin tone')
      return
    }
    setError('')
    setStep(prev => prev + 1)
  }

  function prevStep() {
    setError('')
    setStep(prev => prev - 1)
  }

  async function handleSubmit() {
  setLoading(true)
  setError('')
  try {
    const { data, error: signUpError } = await supabase.auth.signInAnonymously()
    if (signUpError) throw signUpError

    const userId = data.user.id

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name: form.name,
        height: parseInt(form.height),
        weight: parseInt(form.weight),
        body_shape: form.body_shape,
        skin_tone: form.skin_tone,
        seasonal_type: form.seasonal_type,
      })
    if (profileError) throw profileError

    navigate('/dashboard')
  } catch (err) {
    setError(err.message)
  }
  setLoading(false)
}

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium">
            Style<span className="text-purple-600">Mate</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Your AI personal stylist</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < step ? 'bg-purple-600' :
                i === step ? 'bg-purple-300' :
                'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1 — Account */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-medium mb-1">Create your account</h2>
            <p className="text-sm text-gray-500 mb-6">Let's get you set up with StyleMate</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Your name</label>
                <input
                  type="text"
                  placeholder="Arjun"
                  value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={e => updateForm('email', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => updateForm('password', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="175"
                    value={form.height}
                    onChange={e => updateForm('height', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="70"
                    value={form.weight}
                    onChange={e => updateForm('weight', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Body shape */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-medium mb-1">Your body shape</h2>
            <p className="text-sm text-gray-500 mb-6">Helps the AI suggest flattering outfit combinations</p>
            <div className="grid grid-cols-3 gap-3">
              {BODY_SHAPES.map(shape => (
                <div
                  key={shape.label}
                  onClick={() => updateForm('body_shape', shape.label)}
                  className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                    form.body_shape === shape.label
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{shape.icon}</div>
                  <div className="text-xs font-medium">{shape.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Skin tone */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-medium mb-1">Your skin tone</h2>
            <p className="text-sm text-gray-500 mb-6">Used for personalised colour recommendations</p>
            <div className="flex gap-3 flex-wrap mb-4">
              {SKIN_TONES.map(tone => (
                <div key={tone.label} className="text-center">
                  <div
                    onClick={() => {
                      updateForm('skin_tone', tone.label)
                      updateForm('seasonal_type', tone.season)
                    }}
                    style={{ backgroundColor: tone.color }}
                    className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all ${
                      form.skin_tone === tone.label
                        ? 'border-purple-600 scale-110'
                        : 'border-transparent'
                    }`}
                  />
                  <div className="text-xs text-gray-400 mt-1">{tone.label}</div>
                </div>
              ))}
            </div>
            {form.seasonal_type && (
              <div className="bg-purple-50 text-purple-700 text-xs px-3 py-2 rounded-lg inline-flex items-center gap-1">
                ✦ {form.skin_tone} — {form.seasonal_type} season detected
              </div>
            )}
          </div>
        )}

        {/* Step 4 — All set */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-medium mb-1">You're all set!</h2>
            <p className="text-sm text-gray-500 mb-6">Your AI stylist profile is ready. Here's your colour palette.</p>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
              <div className="text-xs font-medium text-purple-700 mb-3">
                ✦ Your palette — {form.seasonal_type}
              </div>
              <div className="flex gap-2 flex-wrap">
                {form.seasonal_type?.includes('Autumn') && (
                  <>
                    {['#D85A30','#854F0B','#639922','#633806','#444441'].map(c => (
                      <div key={c} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full" />
                    ))}
                  </>
                )}
                {form.seasonal_type?.includes('Spring') && (
                  <>
                    {['#F5C08A','#97C459','#EF9F27','#5DCAA5','#F0997B'].map(c => (
                      <div key={c} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full" />
                    ))}
                  </>
                )}
                {form.seasonal_type?.includes('Summer') && (
                  <>
                    {['#85B7EB','#ED93B1','#AFA9EC','#5DCAA5','#B4B2A9'].map(c => (
                      <div key={c} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full" />
                    ))}
                  </>
                )}
                {form.seasonal_type?.includes('Winter') && (
                  <>
                    {['#534AB7','#A32D2D','#2C2C2A','#185FA5','#D4537E'].map(c => (
                      <div key={c} style={{ backgroundColor: c }} className="w-8 h-8 rounded-full" />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 border border-gray-200 text-sm py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              Back
            </button>
          )}
          {step < 4 && (
            <button
              onClick={nextStep}
              className="flex-1 bg-purple-600 text-white text-sm py-2 rounded-lg hover:bg-purple-700 transition-all"
            >
              Continue
            </button>
          )}
          {step === 4 && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-purple-600 text-white text-sm py-2 rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Go to my wardrobe →'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Onboarding