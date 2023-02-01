package com.increff.employee.dao;

import com.increff.employee.pojo.OrderItemPojo;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.List;

@Repository
public class OrderItemDao extends AbstractDao {

	private static String select_id = "select p from OrderItemPojo p where orderId=:orderId";
	private static String delete_id = "delete from OrderItemPojo p where id=:id";


	@PersistenceContext
	private EntityManager em;

	@Transactional
	public void insert(OrderItemPojo p) {
		em.persist(p);
	}


	public List<OrderItemPojo> select(int orderId) {
		TypedQuery<OrderItemPojo> query = getQuery(select_id, OrderItemPojo.class);
		query.setParameter("orderId", orderId);
		return query.getResultList();
	}
	public int delete(int id) {
		Query query = em.createQuery(delete_id);
		query.setParameter("id", id);
		return query.executeUpdate();
	}

	public void update(OrderItemPojo p) {
	}



}
