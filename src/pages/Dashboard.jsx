import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import './Dashboard.css'

// YOUR SUPABASE CONNECTION
const supabaseUrl = 'https://kfusttbmgbxklwnexdyk.supabase.co'
const supabaseKey = 'sb_publishable_XGyHpQhM0l2YLZPrQSqSSg_I0axJuXd'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'crafts',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false })
    if (error) console.log('Error:', error)
    else setProducts(data)
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.from('products').insert([{
      name: formData.name, price: parseFloat(formData.price), description: formData.description, category: formData.category, sales: 0
    }]).select()
    if (error) alert('Error: ' + error.message)
    else {
      setProducts([data[0],...products])
      setFormData({ name: '', price: '', description: '', category: 'crafts' })
      setShowForm(false)
      alert('Product added!')
    }
  }

  const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0)
  const totalRevenue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.sales || 0)), 0)
