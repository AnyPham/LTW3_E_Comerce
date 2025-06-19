import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  return (
    <div className="checkoutPopup">
      <Modal 
        show={show} 
        onHide={handleClose}
        size="lg"
        centered
        backdrop="static"
        className="checkout-modal"
      >
        <Modal.Header 
          closeButton
          style={{
            background: 'linear-gradient(45deg, #ff4081 0%, #ff7043 100%)',
            color: 'white',
            border: 'none',
            padding: '1.2rem 1.5rem'
          }}
        >
          <Modal.Title style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}>
            <i className="fas fa-shopping-bag"></i>
            Xác nhận đơn hàng
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{padding: '1.5rem'}}>
          <div className="checkout-summary" style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h5 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#424242',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="fas fa-info-circle"></i>
              Thông tin đơn hàng
            </h5>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              fontSize: '0.95rem',
              color: '#757575'
            }}>
              <span>Số lượng sản phẩm:</span>
              <span style={{fontWeight: '500', color: '#424242'}}>{cartItems.length}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              fontSize: '0.95rem',
              color: '#757575'
            }}>
              <span>Tổng số lượng:</span>
              <span style={{fontWeight: '500', color: '#424242'}}>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              fontSize: '0.95rem',
              color: '#757575'
            }}>
              <span>Phí vận chuyển:</span>
              <span style={{fontWeight: '500', color: '#4caf50'}}>Miễn phí</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px dashed #e0e0e0',
              fontSize: '1.2rem',
              fontWeight: '700'
            }}>
              <span style={{color: '#424242'}}>Tổng thanh toán:</span>
              <span style={{color: '#ff4081'}}>{parseInt(totalPrice).toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
          
          <h5 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#424242',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-box"></i>
            Chi tiết sản phẩm
          </h5>
          
          <div className="checkout-items" style={{
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '0.5rem'
          }}>
            {cartItems.map((item, index) => (
              <div key={item.id} className="checkout-item" style={{ 
                display: 'flex',
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  marginRight: '1rem',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1px solid #f0f0f0'
                }}>
                  <img 
                    src={`/images/${item.imageName}`} 
                    alt={item.name} 
                    style={{ 
                      maxWidth: '90%',
                      maxHeight: '90%',
                      objectFit: 'contain'
                    }} 
                  />
                </div>
                
                <div style={{flex: '1'}}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#212121',
                    marginBottom: '0.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: '1',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.name}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.9rem',
                      color: '#757575'
                    }}>
                      <span>SL: <strong style={{color: '#424242'}}>{item.quantity}</strong></span>
                      <span>Đơn giá: <strong style={{color: '#424242'}}>{parseInt(item.price).toLocaleString('vi-VN')}₫</strong></span>
                    </div>
                    
                    <div style={{
                      fontWeight: '600',
                      color: '#ff4081',
                      fontSize: '1rem'
                    }}>
                      {parseInt(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        
        <Modal.Footer style={{
          borderTop: '1px solid #f0f0f0',
          padding: '1.2rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            disabled={isProcessing}
          >
            <i className="fas fa-times"></i>
            Hủy
          </Button>
          
          <Button 
            variant="primary" 
            onClick={() => {
              setIsProcessing(true);
              // Giả lập thời gian xử lý thanh toán
              setTimeout(() => {
                handleCheckout();
                setIsProcessing(false);
              }, 1500);
            }}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '600',
              background: 'linear-gradient(45deg, #ff4081 0%, #ff7043 100%)',
              border: 'none',
              boxShadow: '0 4px 10px rgba(255, 64, 129, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!isProcessing) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 15px rgba(255, 64, 129, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isProcessing) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 10px rgba(255, 64, 129, 0.3)';
              }
            }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: '8px' }}
                />
                Đang xử lý...
              </>
            ) : (
              <>
                <i className="fas fa-check-circle"></i>
                Xác nhận đặt hàng
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CheckoutPopup;
