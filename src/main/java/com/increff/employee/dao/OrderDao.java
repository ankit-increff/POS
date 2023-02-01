package com.increff.employee.dao;

import com.increff.employee.pojo.OrderPojo;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Repository
public class OrderDao extends AbstractDao {

	private static String select_all = "select p from OrderPojo p";
	private static String select_id = "select p from OrderPojo p where id=:id";
	private static String get_by_time = "select p from OrderPojo p where date>=:start and date<=:end";

	@PersistenceContext
	private EntityManager em;

	@Transactional
	public int insert(OrderPojo p) {
		em.persist(p);
		return p.getId();
	}

	public List<OrderPojo> selectAll() {
		TypedQuery<OrderPojo> query = getQuery(select_all, OrderPojo.class);
		return query.getResultList();
	}

	public OrderPojo select(int id) {
		TypedQuery<OrderPojo> query = getQuery(select_id, OrderPojo.class);
		query.setParameter("id", id);
		return getSingle(query);
	}

	public List<OrderPojo> selectAllInTimeDuration(Date start, Date end) {
		TypedQuery<OrderPojo> query = getQuery(get_by_time, OrderPojo.class);
		query.setParameter("start", start);
		query.setParameter("end", end);
		return query.getResultList();
	}



	public void update(OrderPojo p) {
	}



}
