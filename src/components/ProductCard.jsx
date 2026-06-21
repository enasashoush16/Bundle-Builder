import React from 'react';

export default function ProductCard({
  product,
  selectedVariantId,
  onVariantChange,
  quantity,
  minQty = 0,
  maxQty = Infinity,
  onQuantityChange
}) {
  const isSelected = quantity > 0;
  const currentVariant = product.variants?.find(v => v.id === selectedVariantId);
  const displayedImage = currentVariant?.variantImage || product.productImage;

  return (
    <div className={`card h-100 p-2 bg-white product-card-container ${isSelected ? 'product-card-selected' : ''}`}>
      {/* Discount Badge */}
      {product.discountBadge && (
        <span className="badge position-absolute top-0 start-0 m-2 px-2 py-1 text-uppercase rounded-pill discount-badge">
          {product.discountBadge}
        </span>
      )}

      {/* Product Image */}
      <div className="d-flex align-items-center justify-content-center product-img-wrapper">
        <img
          src={displayedImage}
          alt={product.title}
          className="img-fluid object-fit-contain max-h-100"
        />
      </div>

      {/* Content */}
      <div className="d-flex flex-column text-start  ">
        <h4 className=" text-dark mb-1 fs-6" >{product.title}</h4>
        <p className="text-muted mb-2 small product-desc">
          {product.description}
          <a href="#learn" className="text-primary text-decoration-underline fw-semibold small" onClick={(e) => e.preventDefault()}>
            Learn More
          </a>
        </p>

      </div>

      {/* Color Swatch Selectors */}
      {product.variants && product.variants.length > 0 && (
        <div className="d-flex flex-nowrap justify-content-center gap-1 align-items-center my-auto">
          {product.variants.map((v) => {
            const isCurrent = selectedVariantId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                className={`btn btn-sm d-flex align-items-center variant-btn ${isCurrent ? 'border-primary' : 'border-secondary'}`}
                style={{
                  backgroundColor: isCurrent ? '#f0fdfa' : '#ffffff',
                  color: '#1a1a1a',
                  fontWeight: isCurrent ? '600' : '400'
                }}
                onClick={() => onVariantChange(v.id)}
              >
                <img
                  src={v.variantImage}
                  alt={v.label}
                  className="object-fit-contain variant-img"

                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Stepper Footer & Pricing */}
      <div className="d-flex align-items-center justify-content-between mt-auto">
        {product.category === 'Plan' ? (
          <button
            className="btn btn-sm px-3 qty-btn"
            onClick={() => onQuantityChange(quantity > 0 ? 0 : 1)}
          >
            {quantity > 0 ? 'Selected ✓' : 'Select'}
          </button>
        ) : (
          <div className="input-group input-group-sm rounded border w-90">
            <button
              className="btn btn-light border-0 fw-bold px-2"
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= minQty}
              style={{
                cursor: quantity <= minQty ? 'not-allowed' : 'pointer',
                opacity: quantity <= minQty ? 0.5 : 1
              }}
            >
              -
            </button>
            <span className="form-control form-control-sm border-0 text-center fw-bold px-0 d-flex align-items-center justify-content-center">
              {quantity}
            </span>
            <button
              className="btn btn-light border-0 fw-bold px-2"
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={quantity >= maxQty}
              style={{
                cursor: quantity >= maxQty ? 'not-allowed' : 'pointer',
                opacity: quantity >= maxQty ? 0.5 : 1
              }}
            >
              +
            </button>
          </div>
        )}

        {/* Pricing */}
        <div className="text-end ms-2">
          {product.salePrice !== null ? (
            <div className="d-flex flex-row align-items-end ">
              <span className="text-decoration-line-through text-danger" >
                ${product.basePrice.toFixed(2)}{product.category === 'Plan' ? '/mo' : ''}
              </span>
              <span className="text-muted ps-3">
                {product.salePrice === 0
                  ? 'Free'
                  : `$${product.salePrice.toFixed(2)}${product.category === 'Plan' ? '/mo' : ''}`
                }
              </span>
            </div>
          ) : (
            <span className="text-muted ">
              ${product.basePrice.toFixed(2)}{product.category === 'Plan' ? '/mo' : ''}
            </span>
          )}
        </div>
      </div>
    </div>

  );
}