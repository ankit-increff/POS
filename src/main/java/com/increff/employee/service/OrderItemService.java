package com.increff.employee.service;

import com.increff.employee.dao.OrderDao;
import com.increff.employee.dao.OrderItemDao;
import com.increff.employee.pojo.OrderItemPojo;
import com.increff.employee.pojo.OrderPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class OrderItemService {

	@Autowired
	private OrderItemDao itemDao;

	//ADDING AN ORDER ITEM
	@Transactional(rollbackOn = ApiException.class)
	public void add(OrderItemPojo p) throws ApiException {
		itemDao.insert(p);
	}

	//GET ALL ORDERITEM BY ORDERID
	@Transactional
	public List<OrderItemPojo> getAllByOrderId(int orderId) {
		return itemDao.select(orderId);
	}

	//DELETING ALL ITEMS BY ORDERID
	@Transactional
	public void delete(int id) {
		itemDao.delete(id);
	}

}
