import { useState, useEffect } from 'react';
import productData from './products.json';
import ProductCard from './components/ProductCard';
import ReviewPanel from './components/ReviewPanel';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import './App.css';

const INITIAL_CART_PRESET = {
  "wyze-cam-v4_white": 1,
  "wyze-cam-pan-v3_white": 2,
  "wyze-motion-sensor_none": 2,
  "wyze-sense-hub_none": 1,
  "wyze-microsd-card_none": 2,
  "wyze-cam-unlimited_none": 1,

};

function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('wyze_security_cart');
    return saved ? JSON.parse(saved) : INITIAL_CART_PRESET;
  });

  const [activeVariants, setActiveVariants] = useState(() => {
    const initial = {};
    productData.forEach(p => {
      if (p.variants && p.variants.length > 0) {
        initial[p.id] = p.variants[0].id;
      }
    });
    return initial;
  });

  const handleQuantityChange = (productId, variantId, newQty) => {
    if (newQty < 0) return;

    setCart(prev => {
      const nextCart = { ...prev };
      const key = variantId ? `${productId}_${variantId}` : `${productId}_none`;
      const motionSensorKey = 'wyze-sense-motion-sensor_none';
      const hubKey = 'wyze-sense-hub_none';
      const hasMotionSensor = (prev[motionSensorKey] || 0) > 0;

      if (productId === 'wyze-sense-hub') {
        if (!hasMotionSensor && newQty > 0) return prev;
        if (hasMotionSensor && newQty > 1) return prev;
      }

      nextCart[key] = newQty;

      if (productId === 'wyze-sense-motion-sensor') {
        if (newQty > 0) {
          nextCart[hubKey] = 1;
        } else if (newQty === 0) {
          nextCart[hubKey] = 0;
        }
      }

      return nextCart;
    });
  };
  const handleSaveToStorage = () => {
    localStorage.setItem('wyze_security_cart', JSON.stringify(cart));
    toast.success('System saved successfully!');
  };

  const getSelectedCountForStep = (stepNumber) => {
    let count = 0;
    const stepProducts = productData.filter(p => p.step === stepNumber);
    stepProducts.forEach(p => {
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach(v => {
          if ((cart[`${p.id}_${v.id}`] || 0) > 0) count += 1;
        });
      } else {
        if ((cart[`${p.id}_none`] || 0) > 0) count += 1;
      }
    });
    return count;
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4 px-2 px-md-3">
      <div className="row g-3 max-w-7xl mx-auto">

        {/* LEFT SELECTION COLUMN */}
        <div className="col-lg-12 col-md-7 col-sm-12">
          <div className="accordion custom-system-accordion border-0">
            {[1, 2, 3, 4].map((stepIdx) => {
              const isOpen = activeStep === stepIdx;
              const stepTitles = ["Choose your cameras", "Choose your plan", "Choose your sensors", "Add extra protection"];
              const selectedCount = getSelectedCountForStep(stepIdx);

              return (
                <div key={stepIdx} className="card border shadow-sm mb-3 rounded-3 overflow-hidden bg-white">

                  {/* Step Header */}
                  <div
                    className="p-3 d-flex justify-content-between align-items-center bg-white cursor-pointer"
                    onClick={() => setActiveStep(isOpen ? null : stepIdx)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center step-header-icon ">
                        {stepIdx === 1 ? '📷' : stepIdx === 2 ? '📋' : stepIdx === 3 ? '🛡️' : '📦'}
                      </div>
                      <div>
                        <div className="text-muted text-uppercase fw-semibold step-label">STEP {stepIdx} OF 4</div>
                        <h5 className=" mb-0 text-dark">{stepTitles[stepIdx - 1]}</h5>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      {selectedCount > 0 && (
                        <span className="badge px-3 py-1 rounded-pill step-selected-badge" >
                          {selectedCount} selected
                        </span>
                      )}
                      <span className="text-muted small fw-bold">{isOpen ? '▼' : '▶'}</span>
                    </div>
                  </div>

                  {/* Open Layout Product Grid View */}
                  {isOpen && (
                    <div className="card-body bg-light border-top p-3">
                      <div className="d-flex flex-wrap flex-lg-nowrap  gap-2 align-items-stretch justify-content-center">
                        {productData
                          .filter(p => p.step === stepIdx)
                          .map(product => {
                            const currentVariantId = activeVariants[product.id] || 'none';
                            const cartKey = product.variants ? `${product.id}_${currentVariantId}` : `${product.id}_none`;
                            const currentQuantity = cart[cartKey] || 0;
                            const hasMotionSensor = (cart['wyze-sense-motion-sensor_none'] || 0) > 0;
                            const minQty = (product.id === 'wyze-sense-hub' && hasMotionSensor) ? 1 : 0;
                            const maxQty = product.id === 'wyze-sense-hub' ? (hasMotionSensor ? 1 : 0) : Infinity;

                            return (
                              <div
                                key={product.id}
                                className={`flex-grow-1`}
                                style={{
                                  flexBasis: '20%',
                                  minWidth: '180px',
                                  maxWidth: stepIdx === 1 ? 'none' : '20rem'
                                }}
                              >
                                <ProductCard
                                  product={product}
                                  selectedVariantId={currentVariantId}
                                  onVariantChange={(vId) => setActiveVariants(prev => ({ ...prev, [product.id]: vId }))}
                                  quantity={currentQuantity}
                                  minQty={minQty}
                                  maxQty={maxQty}
                                  onQuantityChange={(newQty) => handleQuantityChange(product.id, product.variants ? currentVariantId : null, newQty)}
                                />
                              </div>
                            );
                          })}
                      </div>

                      {stepIdx < 4 && (
                        <div className="text-center mt-4">
                          <button className="btn btn-wyze-outline px-4 py-2 fw-bold" onClick={() => setActiveStep(stepIdx + 1)}>
                            Next: {stepIdx === 1 ? 'Choose your plan' : stepIdx === 2 ? 'Choose your sensors' : 'Add extra protection'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE SUMMARY INVOICE PANEL */}
        <div className="col-lg-12 col-md-5 col-sm-12">
          <Toaster position="top-center" />
          <ReviewPanel
            cart={cart}
            productData={productData}
            onQuantityChange={handleQuantityChange}
            onSave={handleSaveToStorage}
          />
        </div>

      </div>
    </div>
  );
}

export default App;