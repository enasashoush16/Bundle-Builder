import React from 'react';
import toast from 'react-hot-toast';

export default function ReviewPanel({ cart, productData, onQuantityChange, onSave }) {
    let finalTotal = 0;
    let originalTotal = 0;
    const activeItems = [];

    // 1. Process items and calculate totals
    Object.keys(cart).forEach(key => {
        const quantity = cart[key];
        if (quantity <= 0) return;

        const [productId, variantId] = key.split('_');
        const product = productData.find(p => p.id === productId);

        if (product) {
            const basePrice = product.basePrice;
            const activePrice = product.salePrice !== null ? product.salePrice : product.basePrice;

            finalTotal += activePrice * quantity;
            originalTotal += basePrice * quantity;

            activeItems.push({
                key, productId, variantId,
                title: product.title,
                category: product.category,
                label: variantId !== 'none' ? variantId : null,
                basePrice,
                activePrice,
                quantity,
                productImage: product.productImage
            });
        }
    });

    const bundleSavings = originalTotal - finalTotal;
    const isShippingFree = bundleSavings > 0;
    const shippingCost = isShippingFree ? 0 : 5.99;
    const grandTotal = finalTotal + shippingCost;

    const groupedItems = activeItems.reduce((acc, item) => {
        const cat = item.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    const priceStyle = { color: '#4E2FD2', fontWeight: 'bold' };

    return (
        <div className="container-fluid p-0 rounded-3 px-3 review-panel-bg">
            <div className="row g-4">

                {/* LEFT COLUMN: Items and Shipping */}
                <div className="col-lg-6 col-sm-12">
                    <div className="mb-4">
                        <h2 className="h3 fw-bold text-dark">Your security system</h2>
                        <p className="text-muted">Review your personalized protection system designed to keep what matters most safe.</p>
                    </div>

                    {Object.keys(groupedItems).map((category) => (
                        <div key={category} className="mb-4">
                            <h6 className="text-uppercase text-muted small border-top pt-2 ">{category}</h6>
                            {groupedItems[category].map((item) => {
                                const isSubscription = item.title.toLowerCase().includes('unlimited');
                                return (
                                    <div key={item.key} className="d-flex align-items-center justify-content-between py-2 ">
                                        <div className="d-flex align-items-center gap-2">
                                            <img src={item.productImage} alt="" className="object-fit-contain item-img" />
                                            <div>
                                                <div className="text-dark">{item.title}</div>
                                                {item.label && <span className="small text-muted text-capitalize">{item.label}</span>}
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            {isSubscription ? (
                                                <button
                                                    className="btn btn-link btn-sm text-danger px-5 text-decoration-none fw-bold"
                                                    onClick={() => onQuantityChange(item.productId, item.variantId === 'none' ? null : item.variantId, 0)}
                                                >
                                                    Remove
                                                </button>
                                            ) : (
                                                <div className="input-group input-group-sm border rounded w-80 mx-4">
                                                    <button className="btn btn-light btn-sm border-0" onClick={() => onQuantityChange(item.productId, item.variantId === 'none' ? null : item.variantId, item.quantity - 1)}>-</button>
                                                    <span className="form-control form-control-sm border-0 text-center bg-white">{item.quantity}</span>
                                                    <button className="btn btn-light btn-sm border-0" onClick={() => onQuantityChange(item.productId, item.variantId === 'none' ? null : item.variantId, item.quantity + 1)}>+</button>
                                                </div>
                                            )}

                                            {/* Price Display */}
                                            <div className="d-flex justify-content-end w-80">
                                                {item.basePrice > item.activePrice && (
                                                    <div className="text-decoration-line-through text-muted pe-2">
                                                        ${(item.basePrice * item.quantity).toFixed(2)}
                                                    </div>
                                                )}
                                                <div className="text-end" style={{ width: '60px', ...priceStyle }}>
                                                    ${(item.activePrice * item.quantity).toFixed(2)}
                                                    {isSubscription && '/mo'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}

                    {/* Shipping Row */}
                    <div className="d-flex justify-content-between py-2 border-bottom">
                        <span className="fw-bold">Fast Shipping</span>
                        <div className="d-flex gap-2">
                            <span className="text-decoration-line-through text-muted small">$5.99</span>
                            <span className={isShippingFree ? "text-web-color fw-bold" : ""} style={isShippingFree ? {} : priceStyle}>
                                {isShippingFree ? 'FREE' : '$5.99'}

                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Summary and Actions */}
                <div className="col-lg-6 col-sm-12">
                    <div className="card p-4 border-0 review-panel-bg">
                        {/* Guarantee Section */}
                        <div className="d-flex gap-3 align-items-center mb-4">
                            <img src="src/assets/Wyze satisfaction guarantee.png" alt="Guarantee" className="guarantee-img" />
                            <div>
                                <h5 className="h6 mb-1">30-day hassle-free returns</h5>
                                <p className="text-muted mb-0">If you're not totally in love with the product, we will refund you 100%.</p>
                            </div>
                        </div>

                        {/* Total Summary */}
                        <div className="d-lg-flex justify-content-between mb-3 align-items-center checkout-price-row d-block     ">
                            <div className="badge text-white me-3 py-1 rounded fs-6 fw-light checkout-btn">
                                as low as $19.19/mo
                            </div>
                            <div className='d-flex align-items-center'>

                                {bundleSavings > 0 && (
                                    <div className="text-decoration-line-through text-muted pe-2">
                                        ${(originalTotal + 5.99).toFixed(2)}
                                    </div>
                                )}
                                <div className="h2 fw-bold" style={priceStyle}>
                                    ${grandTotal.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {bundleSavings > 0 && (
                            <div className="text-center text-success fw-bold small mb-3">
                                🎉 Congrats! You’re saving ${bundleSavings.toFixed(2)} on your security bundle!
                            </div>
                        )}

                        <button
                            className="btn btn-primary w-100 py-3 fw-bold mb-3 checkout-btn"
                            onClick={() => {
                                toast.success('Order submitted!');
                            }}
                        >
                            Checkout
                        </button>

                        <div className="text-center">
                            <button
                                className="btn btn-link text-muted small"
                                onClick={onSave}
                            >
                                Save my system for later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}