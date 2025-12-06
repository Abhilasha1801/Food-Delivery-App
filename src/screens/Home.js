import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
// import Carousel from '../components/Carousel'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
export default function Home() {
  const [foodCat, setFoodCat] = useState([])
  const [foodItems, setFoodItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadFoodItems = async () => {
    try {
      setLoading(true)
      setError(null)
      let response = await fetch("http://localhost:5000/api/auth/foodData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch food data')
      }

      const data = await response.json()
      
      // Ensure we have valid data
      if (!Array.isArray(data) || !data[0] || !data[1]) {
        throw new Error('Invalid data format received')
      }

      // Add default images and ensure all required fields exist
      const processedFoodItems = data[0].map(item => ({
        ...item,
        _id: item._id || item.id, // Ensure we have an ID
        name: item.name || '',
        CategoryName: item.CategoryName || '',
        img: item.img || `https://source.unsplash.com/featured/?${item.name?.replace(' ', '-') || 'food'}`,
        options: item.options || [{}]
      }));

      setFoodItems(processedFoodItems)
      setFoodCat(data[1])
    } catch (err) {
      console.error('Error loading food items:', err)
      setError('Failed to load food items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFoodItems()
  }, [])

  return (
    <div >
      <div>
        <Navbar />
      </div>
      <div>
        <div id="carouselExampleFade" className="carousel slide carousel-fade " data-bs-ride="carousel">

          <div className="carousel-inner " id='carousel'>
            <div class=" carousel-caption  " style={{ zIndex: "9" }}>
              <div className="d-flex justify-content-center">
                <div className="input-group w-75">
                  <input 
                    className="form-control bg-white text-dark" 
                    type="search" 
                    placeholder="Search for food items..." 
                    aria-label="Search" 
                    value={search} 
                    onChange={(e) => { setSearch(e.target.value.trim()) }}
                    onKeyPress={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                  />
                  {search && (
                    <button 
                      className="btn btn-danger" 
                      type="button" 
                      onClick={() => { setSearch('') }}
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="carousel-item active" >
              <img src="https://assets.cntraveller.in/photos/60ba26c0bfe773a828a47146/16:9/w_1024%2Cc_limit/Burgers-Mumbai-Delivery.jpg" className="d-block w-100  " style={{ filter: "brightness(30%)", height: "65vh", objectFit: "cover" }} alt="..." />
            </div>
            <div className="carousel-item">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYgxz8n2ewn4kvCcRO0DpKjEc1-uOr2N-6ZQ&s" className="d-block w-100 " style={{ filter: "brightness(30%)", height: "65vh", objectFit: "cover" }} alt="..." />
            </div>
            <div className="carousel-item">
              <img src="https://www.safefood.net/getmedia/85b3b919-bc29-45da-932f-5b41d3d9140e/healthy-bbq.jpg?w=1200&h=675&ext=.jpg&width=1360&resizemode=force" className="d-block w-100 " style={{ filter: "brightness(30%)", height: "65vh", objectFit: "cover" }} alt="..." />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className='container'>
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center my-5" role="alert">
            {error}
          </div>
        ) : foodCat && foodCat.length > 0 ? (
          foodCat.map((data, index) => {
              // First, filter the items for this category
              const filteredItems = foodItems.filter(items => {
                const nameMatch = items.name.toLowerCase().includes(search.toLowerCase());
                const categoryMatch = items.CategoryName === data.CategoryName;
                return search ? nameMatch && categoryMatch : categoryMatch;
              });

              // Only render the category if it has matching items or there's no search
              if (filteredItems.length === 0 && search) {
                return null;
              }

              return (
                <div key={`category-${index}`} className='row mb-3'>
                  <div className='fs-3 m-3'>
                    {data.CategoryName}
                  </div>
                  <hr id="hr-success" style={{ height: "4px", backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))" }} />
                  {filteredItems.length > 0 ? (
                    filteredItems.map(filterItems => (
                      <div key={filterItems._id} className='col-12 col-md-6 col-lg-3'>
                        <Card 
                          foodName={filterItems.name} 
                          item={filterItems} 
                          options={filterItems.options[0]} 
                          ImgSrc={filterItems.img || `https://source.unsplash.com/featured/?${encodeURIComponent(filterItems.name)},food`} 
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center w-100">No matching items in this category</div>
                  )}
                </div>
              )
            })
        ) : (
          <div className="text-center my-5">
            <p>No food items available</p>
          </div>
        )}
      </div>
      <Footer />
    </div>









  )
}
