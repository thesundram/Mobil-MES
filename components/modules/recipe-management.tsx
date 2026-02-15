'use client'

import { useState } from 'react'
import { mockProducts, mockRecipes } from '@/lib/mockData'
import { Plus, Edit2, Trash2, Heart, Save, X } from 'lucide-react'

export default function RecipeManagement() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null)
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>(['recipe_1', 'recipe_2'])
  
  // Form state
  const [formData, setFormData] = useState({
    productId: mockProducts[0]?.id || 'prod_1',
    baseOilPct: 85,
    additiveAPct: 10,
    additiveBPct: 5,
    toleranceBase: 2,
    toleranceAdditive: 1,
  })

  const selectedProduct = mockProducts?.find(p => p.id === formData.productId)
  const currentRecipe = selectedRecipe ? mockRecipes?.find(r => r.id === selectedRecipe) : null

  const handleSaveRecipe = () => {
    // In a real app, this would save to database
    if (view === 'create' || view === 'edit') {
      setView('list')
      setSelectedRecipe(null)
      setFormData({
        productId: 'prod_1',
        baseOilPct: 85,
        additiveAPct: 10,
        additiveBPct: 5,
        toleranceBase: 2,
        toleranceAdditive: 1,
      })
    }
  }

  const handleToggleFavorite = (recipeId: string) => {
    if (favoriteRecipes.includes(recipeId)) {
      setFavoriteRecipes(favoriteRecipes.filter(id => id !== recipeId))
    } else {
      setFavoriteRecipes([...favoriteRecipes, recipeId])
    }
  }

  const handleEditRecipe = (recipe: any) => {
    setFormData({
      productId: recipe.productId,
      baseOilPct: recipe.baseOilPct,
      additiveAPct: recipe.additiveAPct,
      additiveBPct: recipe.additiveBPct,
      toleranceBase: recipe.toleranceBase,
      toleranceAdditive: recipe.toleranceAdditive,
    })
    setSelectedRecipe(recipe.id)
    setView('edit')
  }

  const isFavorite = selectedRecipe ? favoriteRecipes.includes(selectedRecipe) : false
  const totalPct = formData.baseOilPct + formData.additiveAPct + formData.additiveBPct

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-blue-900">Recipe Management</h2>
          <p className="text-blue-600 mt-1">Create and manage oil blending formulations</p>
        </div>
        {view === 'list' && (
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Recipe
          </button>
        )}
      </div>

      {/* VIEW: List */}
      {view === 'list' && (
        <div className="space-y-4">
          {!mockRecipes || mockRecipes.length === 0 ? (
            <div className="bg-white border border-blue-200 rounded-lg p-12 text-center">
              <p className="text-blue-600 mb-4">No recipes available yet.</p>
              <button
                onClick={() => setView('create')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create First Recipe
              </button>
            </div>
          ) : (
            <>
              {/* Favorites Section */}
              <div className="bg-white border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  Favorite Recipes
                </h3>
                {favoriteRecipes.length === 0 ? (
                  <p className="text-blue-600 text-sm">No favorite recipes yet. Star a recipe to add it here.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockRecipes
                      .filter(r => favoriteRecipes.includes(r.id))
                      .map(recipe => {
                        const product = mockProducts?.find(p => p.id === recipe.productId)
                        return (
                          <div
                            key={recipe.id}
                            className="bg-blue-50 border border-blue-300 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedRecipe(recipe.id)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-semibold text-blue-900">{product?.viscosityGrade || 'N/A'}</p>
                                <p className="text-sm text-blue-600">{product?.name || 'Unknown'}</p>
                              </div>
                              <Heart
                                className="w-5 h-5 fill-red-500 text-red-500 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleToggleFavorite(recipe.id)
                                }}
                              />
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-blue-600">Base Oil:</span>
                                <span className="font-semibold text-blue-900">{recipe.baseOilPct}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-600">Additive A:</span>
                                <span className="font-semibold text-blue-900">{recipe.additiveAPct}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-600">Additive B:</span>
                                <span className="font-semibold text-blue-900">{recipe.additiveBPct}%</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>

              {/* All Recipes Section */}
              <div className="bg-white border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">All Recipes ({mockRecipes.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-blue-200">
                        <th className="text-left py-3 px-4 font-semibold text-blue-900">Product</th>
                        <th className="text-center py-3 px-4 font-semibold text-blue-900">Base Oil %</th>
                        <th className="text-center py-3 px-4 font-semibold text-blue-900">Additive A %</th>
                        <th className="text-center py-3 px-4 font-semibold text-blue-900">Additive B %</th>
                        <th className="text-center py-3 px-4 font-semibold text-blue-900">Total %</th>
                        <th className="text-center py-3 px-4 font-semibold text-blue-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRecipes.map(recipe => {
                        const product = mockProducts?.find(p => p.id === recipe.productId)
                        const total = recipe.baseOilPct + recipe.additiveAPct + recipe.additiveBPct
                        const isFav = favoriteRecipes.includes(recipe.id)
                        return (
                          <tr
                            key={recipe.id}
                            className="border-b border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-blue-900 font-medium">
                              <div>
                                <p className="font-semibold">{product?.viscosityGrade || 'N/A'}</p>
                                <p className="text-xs text-blue-600">{product?.baseOilType || 'Unknown'}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center text-blue-900 font-semibold">
                              {recipe.baseOilPct}%
                            </td>
                            <td className="py-3 px-4 text-center text-blue-900 font-semibold">
                              {recipe.additiveAPct}%
                            </td>
                            <td className="py-3 px-4 text-center text-blue-900 font-semibold">
                              {recipe.additiveBPct}%
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${total === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {total}%
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleToggleFavorite(recipe.id)}
                                  className="p-1 hover:bg-blue-200 rounded transition-colors"
                                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                  <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-blue-600'}`} />
                                </button>
                                <button
                                  onClick={() => handleEditRecipe(recipe)}
                                  className="p-1 hover:bg-blue-200 rounded transition-colors"
                                  title="Edit recipe"
                                >
                                  <Edit2 className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                  className="p-1 hover:bg-red-200 rounded transition-colors"
                                  title="Delete recipe"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* VIEW: Create/Edit Recipe */}
      {(view === 'create' || view === 'edit') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recipe Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Selection */}
            <div className="bg-white border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Recipe Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">Product Grade</label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 focus:border-blue-500 focus:outline-none"
                  >
                    {mockProducts && mockProducts.length > 0 ? (
                      mockProducts.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.viscosityGrade} - {product.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No products available</option>
                    )}
                  </select>
                </div>

                {selectedProduct && selectedProduct.specs ? (
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <p className="text-sm text-blue-600 mb-2">Product Specifications:</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-600">Viscosity Index</p>
                        <p className="font-semibold text-blue-900">{selectedProduct.specs.viscosityIndex?.min || 'N/A'}-{selectedProduct.specs.viscosityIndex?.max || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-blue-600">TAN</p>
                        <p className="font-semibold text-blue-900">{selectedProduct.specs.tan?.min || 'N/A'}-{selectedProduct.specs.tan?.max || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Oxidation Stability</p>
                        <p className="font-semibold text-blue-900">{selectedProduct.specs.oxidationStability?.min || 'N/A'}-{selectedProduct.specs.oxidationStability?.max || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Ingredients Input */}
            <div className="bg-white border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Ingredients & Percentages</h3>
              <div className="space-y-4">
                {/* Base Oil */}
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Base Oil A (%)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.baseOilPct}
                    onChange={(e) => setFormData({ ...formData, baseOilPct: Number(e.target.value) })}
                    className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-blue-600 mt-1">Tolerance: ±{formData.toleranceBase}%</p>
                </div>

                {/* Additive A */}
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Additive X (%)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.additiveAPct}
                    onChange={(e) => setFormData({ ...formData, additiveAPct: Number(e.target.value) })}
                    className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-blue-600 mt-1">Tolerance: ±{formData.toleranceAdditive}%</p>
                </div>

                {/* Additive B */}
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Additive Y (%)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.additiveBPct}
                    onChange={(e) => setFormData({ ...formData, additiveBPct: Number(e.target.value) })}
                    className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-blue-600 mt-1">Tolerance: ±{formData.toleranceAdditive}%</p>
                </div>
              </div>
            </div>

            {/* Tolerance Settings */}
            <div className="bg-white border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Quality Tolerances</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">Base Oil Tolerance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.toleranceBase}
                    onChange={(e) => setFormData({ ...formData, toleranceBase: Number(e.target.value) })}
                    className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">Additive Tolerance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.toleranceAdditive}
                    onChange={(e) => setFormData({ ...formData, toleranceAdditive: Number(e.target.value) })}
                    className="w-full bg-blue-50 border border-blue-200 rounded px-3 py-2 text-blue-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Preview Sidebar */}
          <div className="space-y-4">
            {/* Summary Card */}
            <div className="bg-white border border-blue-200 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Recipe Summary</h3>
              
              {/* Product Info */}
              <div className="mb-4 pb-4 border-b border-blue-200">
                <p className="text-xs text-blue-600 uppercase tracking-wider mb-1">Product</p>
                <p className="font-semibold text-blue-900">{selectedProduct?.viscosityGrade || 'Select Product'}</p>
                <p className="text-sm text-blue-600">{selectedProduct?.name || 'No product selected'}</p>
              </div>

              {/* Ingredients Breakdown */}
              <div className="space-y-3 mb-4 pb-4 border-b border-blue-200">
                <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">Ingredients</p>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-blue-600">Base Oil A</span>
                    <span className="font-semibold text-blue-900">{formData.baseOilPct}%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all"
                      style={{ width: `${formData.baseOilPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-blue-600">Additive X</span>
                    <span className="font-semibold text-blue-900">{formData.additiveAPct}%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all"
                      style={{ width: `${formData.additiveAPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-blue-600">Additive Y</span>
                    <span className="font-semibold text-blue-900">{formData.additiveBPct}%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-400 h-full transition-all"
                      style={{ width: `${formData.additiveBPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="mb-4 pb-4 border-b border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-blue-900">Total</span>
                  <span className={`text-lg font-bold ${totalPct === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalPct}%
                  </span>
                </div>
                {totalPct !== 100 && (
                  <p className="text-xs text-red-600 mt-1">⚠ Must equal 100%</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleSaveRecipe}
                  disabled={totalPct !== 100}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    totalPct === 100
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Save Recipe
                </button>
                <button
                  onClick={() => {
                    setView('list')
                    setSelectedRecipe(null)
                    setFormData({
                      productId: 'prod_1',
                      baseOilPct: 85,
                      additiveAPct: 10,
                      additiveBPct: 5,
                      toleranceBase: 2,
                      toleranceAdditive: 1,
                    })
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-900 py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
